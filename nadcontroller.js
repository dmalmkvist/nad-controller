const EventEmitter = require('events');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

const DEFAULT_BAUD_RATE = 115200;

/**
 * Manage commands sent over the serial port, making sure there
 * are never more then one outstanding command.
 */
class CommandManager extends EventEmitter {

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

/**
 * Represent a command sent over the serial port
 */
class Command extends EventEmitter {

  constructor(command, callback, port, parser) {
    super();
    this.command = command;
    this.callback = callback;
    this.port = port;
    this.parser = parser;
    this.isDone = false;
  }

  onData(data) {
    if (!this.isDone) {
      this.isDone = true;
      this.callback(null, data);
      this.emit('done');
    }
  }

  onTimeout() {
    if (!this.isDone) {
      this.isDone = true;
      this.callback('Timout: command: ' + this.command);
      this.emit('done');
    }
  }

  onError(error) {
    if (error && !this.isDone) {
      this.isDone = true;
      this.callback(error);
      this.emit('done');
    }
  }

  execute() {

    this.parser.once('data', this.onData.bind(this));
    var shouldDrain = this.port.write('\r' + this.command + '\r', 'UTF-8', this.onError.bind(this));

    if (shouldDrain) {
      this.port.drain(this.onError.bind(this));
    }

    setTimeout(this.onTimeout.bind(this), 1000);
  }
}

class PortGate {

  constructor(port) {
    this._isOpen = false;
    this.port = port;
    port.on('open', () => this._isOpen = true);
    port.on('close', () => this._isOpen = false);
  }

  getPort() {
    return this.port;
  }

  isOpen() {
    return this._isOpen;
  }

  open(callback) {
    if (this.isOpen()) {
      callback('ERROR: port is already open');
    }
    this.port.open(callback);
  }

  close(callback) {
    if (!this.isOpen()) {
      callback('ERROR: port is already closed');
    }
    this.port.close(callback);
  }
}

module.exports = class NadController {

  constructor(portPath, options) {

    let { baudRate } = options || {};
    if (!baudRate) {
      baudRate = DEFAULT_BAUD_RATE;
    }

    this.port = new SerialPort(portPath, {
      'baudRate': baudRate,
      'autoOpen': false
    });

    this.portGate = new PortGate(this.port);
    this.commandManager = new CommandManager(this.portGate);
  }

  isOpen() {
    return this.portGate.isOpen();
  }

  open(callback) {
    return this.portGate.open(callback);
  }

  close(callback) {
    return this.portGate.close(callback);
  }

  get(command, callback) {
    this.commandManager.add(command, callback);
  }

  set(command, value, callback) {
    this.commandManager.add(command, callback);
  }

  increment(command, callback) {
    this.commandManager.add(command, callback);
  }

  decrement(command, callback) {
    this.commandManager.add(command, callback);
  }
};


