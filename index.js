const EventEmitter = require('events');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

const PortGate = require('./src/portgate');
const TaskManager = require('./src/task-manager');
const Command = require('./src/command');
const CommandValidator = require('./src/command-validator');

const DEFAULT_BAUD_RATE = 115200;

const MODELS_CONFIG = Object.freeze({
  C355: '../config/nad-c355.json'
});

class NadController extends EventEmitter {

  static get MODELS() {
    return MODELS_CONFIG;
  }

  constructor(portPath, options) {
    super();

    let { baudRate, commandListFile, model } = options || {};
    if (!baudRate) {
      baudRate = DEFAULT_BAUD_RATE;
    }

    if (!commandListFile && model) {
      commandListFile = model;
    }

    if (!commandListFile) {
      throw 'Missing model configuration file';
    }

    this._commandValidator = CommandValidator.commandValidatorFromFile(commandListFile);

    this._port = new SerialPort(portPath, {
      'baudRate': baudRate,
      'autoOpen': false
    });

    this._port.on('error', (error) => {
      this.emit('error', 'SerialPort error: ' + error);
    });

    this._portGate = new PortGate(this._port);
    this._taskManager = new TaskManager(this._portGate);
    this._taskManager.on('update', onData.bind(this));
  }

  isOpen() {
    return this._portGate.isOpen();
  }

  open(callback) {
    return this._portGate.open(callback);
  }

  close(callback) {
    return this._portGate.close(callback);
  }

  get(command, callback) {
    let cmd = new Command(command, '?');
    verifyCommand(cmd, this._commandValidator);
    this._taskManager.add(cmd, callback);
  }

  set(command, value, callback) {
    let cmd = new Command(command, '=', value);
    verifyCommand(cmd, this._commandValidator);
    this._taskManager.add(cmd, callback);
  }

  increment(command, callback) {
    let cmd = new Command(command, '+');
    verifyCommand(cmd, this._commandValidator);
    this._taskManager.add(cmd, callback);
  }

  decrement(command, callback) {
    let cmd = new Command(command, '-');
    verifyCommand(cmd, this._commandValidator);
    this._taskManager.add(cmd, callback);
  }

  getAllStates(callback) {

    let scopedRead = readPromise.bind(this);

    let readPromises = this._commandValidator.getReadCommands()
      .map((command) => {
        return new Promise(function(resolve, reject) {
          scopedRead(command, resolve, reject);
        })
      });

    Promise.all(readPromises)
      .then((values) => callback(null, values))
      .catch((error) => callback(error));
  }
};

const readPromise = function(command, resolve, reject) {

  this.get(command, (error, data) => {
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  });
}

const onData = function(data) {
  this.emit('update', data);
};

const verifyCommand = function(command, commandValidator) {
  if (!commandValidator.isValid(command)) {
    throw 'Invalid command: ' + command.toString();
  }
};

module.exports.NadController = NadController;
module.exports.MODELS = MODELS_CONFIG;