const Command = require('./command');
const EventEmitter = require('events');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

/**
 * Manage commands sent over the serial port, making sure there
 * are never more then one outstanding command.
 */
module.exports = class CommandManager extends EventEmitter {

  constructor(portGate) {
    super();
    this.portGate = portGate;

    this.port = portGate.getPort();
    this.parser = new Readline({ delimiter: '\r' });
    this.port.pipe(this.parser);

    this.on('CommandAdded', this.runCommand);
    this.busy = false;
    this.commandQueue = [];
  }

  add(commandString, callback) {
    if (!this.portGate.isOpen()) {
      callback('ERROR: port is closed');
    }

    let cmd = new Command(commandString, callback, this.port, this.parser);
    this.commandQueue.push(cmd);
    this.emit('CommandAdded');
  }

  runCommand() {
    if (this.busy) {
      return;
    }

    if (this.commandQueue.length === 0) {
      return;
    }

    let command = this.commandQueue.splice(0, 1)[0];

    command.once('done', () => {
      this.busy = false;
      this.runCommand();
    });

    this.busy = true;
    command.execute();
  }
}
