
module.exports = class PortGate {

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
