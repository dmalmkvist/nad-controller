const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

const PortGate = require('./portgate');
const TaskManager = require('./task-manager');
const Command = require('./command');
const CommandValidator = require('./command-validator');

const DEFAULT_BAUD_RATE = 115200;

module.exports = class NadController {

  constructor(portPath, commandListFile, options) {

    let { baudRate } = options || {};
    if (!baudRate) {
      baudRate = DEFAULT_BAUD_RATE;
    }

    this.commandValidator = CommandValidator.commandValidatorFromFile(commandListFile);

    this.port = new SerialPort(portPath, {
      'baudRate': baudRate,
      'autoOpen': false
    });

    this.portGate = new PortGate(this.port);
    this.taskManager = new TaskManager(this.portGate);
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
};

const verifyCommand = function(command, commandValidator, callback) {
  if (!commandValidator.isValid(command)) {
    throw 'Invalid command: ' + command.toString();
  }
};