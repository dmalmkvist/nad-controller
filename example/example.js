const NadController = require('../src/nad-controller');

let controller = new NadController('/dev/ttyUSB0', '../config/nad-c355.json');


let open = function() {
	return new Promise(function(resolve, reject) {
		controller.open((error) => {
			if (error) {
				reject(error);
			}
			else {
				resolve();
			}
		});
	});
};

let close = function() {
	return new Promise(function(resolve, reject) {
		controller.close((error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
};

let testIsOpened = function() {
	return new Promise(function(resolve, reject) {
		if (controller.isOpen()) {
			resolve();
		} else {
			reject('Should be open');
		}
	});
};

let testIsClosed = function() {
	return new Promise(function(resolve, reject) {
		if (!controller.isOpen()) {
			resolve();
		} else {
			reject('Should be closed');
		}
	});
};

let createRead = function(command) {
	return function() {
		return new Promise(function(resolve, reject) {
			controller.get(command, function(error, data) {
				if (error) {
					reject(error);
				} else {
					console.log('Read ' + command + ': ', data);
					resolve(data);
				}
			});
		});
	};
};

let createWrite = function(command, value) {
	return function() {
		return new Promise(function(resolve, reject) {
			controller.set(command, value, function(error, data) {
				if (error) {
					reject(error);
				} else {
					console.log('Write ' + command + ': ', data);
					resolve(data);
				}
			});
		});
	};
};

let createIncrement = function(command) {
	return function() {
		return new Promise(function(resolve, reject) {
			controller.increment(command, function(error, data) {
				if (error) {
					reject(error);
				} else {
					console.log('Increment ' + command + ': ', data);
					resolve(data);
				}
			});
		});
	};
};

let createDecrement = function(command) {
	return function() {
		return new Promise(function(resolve, reject) {
			controller.decrement(command, function(error, data) {
				if (error) {
					reject(error);
				} else {
					console.log('Decrement ' + command + ': ', data);
					resolve(data);
				}
			});
		});
	};
};

open()
.then(testIsOpened)
.then(close)
.then(testIsClosed)
.then(open)
.then(testIsOpened)
.then(createRead('Main.Model'))
.then(createRead('Main.Source'))
.then(createWrite('Main.Source', 'Video'))
.then(createRead('Main.Source'))
.then(createWrite('Main.Source', 'Aux'))
.then(createRead('Main.Source'))
.then(createRead('Main.SpeakerA'))
.then(createIncrement('Main.SpeakerA'))
.then(createRead('Main.SpeakerA'))
.then(createDecrement('Main.SpeakerA'))
.then(createRead('Main.SpeakerA'))
.then((data) => console.log('SUCCESS: ', data))
.catch((error) => console.log('ERROR: ', error));

