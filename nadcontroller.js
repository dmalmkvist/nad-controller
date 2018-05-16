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
		this.port.on('error', (error) => console.log('error:', error));
		this.parser.on('data', (data) => console.log('data:', data));
  }

  open(callback) {
		this.port.open(callback);
  }

  close(callback) {
  	this.port.close(callback);
  }

  isOpen() {
  	return this.isPortOpen;
  }

  get(command, callback) {
  	if (!this.isOpen()) {
  		callback('ERROR: port is closed');
  	}

  	var shouldDrain = this.port.write('\r' + command + '?\r', 'UTF-8', (error) => {
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
  	// wait for data to come back
 		callback(null, 'dummy data');
  }
};

