const EventEmitter = require('events');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

const PortGate = require('./portgate');
const TaskManager = require('./task-manager');

const DEFAULT_BAUD_RATE = 115200;

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
    this.taskManager.add(command, callback);
  }

  set(command, value, callback) {
    this.taskManager.add(command, callback);
  }

  increment(command, callback) {
    this.taskManager.add(command, callback);
  }

  decrement(command, callback) {
    this.taskManager.add(command, callback); }
};


