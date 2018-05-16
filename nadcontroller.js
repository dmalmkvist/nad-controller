const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

const DEFAULT_BAUD_RATE = 115200;

module.exports = class NadController {
  
  constructor(port, baudRate) {
  	if (!baudRate) {
  		baudRate = DEFAULT_BAUD_RATE;
  	}

  	this.isPortOpen = false;

    this.port = new SerialPort(port, { 
    	'baudRate': baudRate, 
    	'autoOpen': false 
    });
		
		this.parser = new Readline({ delimiter: '\r' });
		this.port.pipe(this.parser);
		this.port.on('open', () => this.isPortOpen = true);
		this.port.on('close', () => this.isPortOpen = false);
		// this.port.on('error', (error) => console.log('error:', error));
		this.parser.on('data', (data) => {
			if (this.activeCall) {
				this.activeCall.consume(data);
			}
		});
  }

  open(callback) {
  	if (this.isPortOpen) {
  		callback('ERROR: port is already open');
  	}
		this.port.open(callback);
  }

  close(callback) {
  	if (!this.isPortOpen) {
  		callback('ERROR: port is already closed');
  	}
  	this.port.close(callback);
  }

  isOpen() {
  	return this.isPortOpen;
  }

  get(command, callback) {
  	if (!this.isOpen()) {
  		callback('ERROR: port is closed');
  	}

  	if (this.activeCall && !this.activeCall.isConsumed()) {
  		callback('ERROR: port busy with command');
  	}

  	var shouldDrain = this.port.write('\r' + command + '\r', 'UTF-8', (error) => {
  		if (error) {
  			callaback(error);
  		}
  	});

  	if (shouldDrain) {
  		this.port.drain((error) => {
  			if (error) {
  				callback(error);
  			}
	  		return;
  		});
  	}

  	this.activeCall = new CallbackTimer(callback, 1000);
  }
};

class CallbackTimer {

	constructor(callback, timeout) {
		this.callback = callback;
		this.consumed = false;
		setTimeout(() => {
			if (!this.consumed) {
				this.callback('ERROR: timeout');
			}
		}, timeout);
	}

	isConsumed() {
		return this.consumed;
	}

	consume(data) {
		this.consumed = true;
		this.callback(null, data);
	}
}

