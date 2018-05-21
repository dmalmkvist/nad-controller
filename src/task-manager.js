const Task = require('./task');
const EventEmitter = require('events');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

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

    this.on('TaskAdded', this.runTask);
    this.busy = false;
    this.taskQueue = [];
  }

  add(commandString, callback) {
    if (!this.portGate.isOpen()) {
      callback('ERROR: port is closed');
    }

    let cmd = new Task(commandString, callback, this.port, this.parser);
    this.taskQueue.push(cmd);
    this.emit('TaskAdded');
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
