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

module.exports = class NadController extends EventEmitter {

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

    this.commandValidator = CommandValidator.commandValidatorFromFile(commandListFile);

    this.port = new SerialPort(portPath, {
      'baudRate': baudRate,
      'autoOpen': false
    });

    this.portGate = new PortGate(this.port);
    this.taskManager = new TaskManager(this.portGate);
    this.taskManager.on('data', onData.bind(this));
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
    let cmd = new Command(command, '?');
    verifyCommand(cmd, this.commandValidator, callback);
    this.taskManager.add(cmd, callback);
  }

  set(command, value, callback) {
    let cmd = new Command(command, '=', value);
    verifyCommand(cmd, this.commandValidator, callback);
    this.taskManager.add(cmd, callback);
  }

  increment(command, callback) {
    let cmd = new Command(command, '+');
    verifyCommand(cmd, this.commandValidator, callback);
    this.taskManager.add(cmd, callback);
  }

  decrement(command, callback) {
    let cmd = new Command(command, '-');
    verifyCommand(cmd, this.commandValidator, callback);
    this.taskManager.add(cmd, callback);
  }

  getAll(callback) {
    // TODO get all commands with ?
    // query and collect
  }
};

const onData = function(data) {
  this.emit('data', data);
};

const verifyCommand = function(command, commandValidator, callback) {
  if (!commandValidator.isValid(command)) {
    throw 'Invalid command: ' + command.toString();
  }
};