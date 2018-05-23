const Task = require('./task');
const EventEmitter = require('events');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const Command = require('./command');

/**
 * Manage tasks sent over the serial port, making sure there
 * are never more then one outstanding task.
 */
module.exports = class TaskManager extends EventEmitter {

  constructor(portGate) {
    super();
    this.portGate = portGate;

    this.port = portGate.getPort();
    this.parser = new Readline({ delimiter: '\r' });
    this.port.pipe(this.parser);
    this.parser.on('data', this.onData.bind(this));

    this.on('TaskAdded', this.runTask);
    this.busy = false;
    this.taskQueue = [];
  }

  onData(data) {
    let command = Command.parseCommand(data);
    let physicalTrigger = this.busy? false : true;
    this.emit('change', {
      'name': command.name,
      'value': command.value,
      'physicalTrigger': physicalTrigger
    });
  }

  add(command, callback) {
    if (!this.portGate.isOpen()) {
      callback('ERROR: port is closed');
    }

    let cmd = new Task(command, callback, this.port, this.parser);
    this.taskQueue.push(cmd);
    this.emit('TaskAdded', cmd);
  }

  runTask() {
    if (this.busy) {
      return;
    }

    if (this.taskQueue.length === 0) {
      return;
    }

    let task = this.taskQueue.splice(0, 1)[0];

    task.once('done', () => {
      this.busy = false;
      this.runTask();
    });

    this.busy = true;
    task.execute();
  }
}
