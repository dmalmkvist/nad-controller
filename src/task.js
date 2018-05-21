const EventEmitter = require('events');

/**
 * Represent a command task sent over the serial port
 */
module.exports = class Task extends EventEmitter {

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
