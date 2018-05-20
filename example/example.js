const NadController = require('../src/nadcontroller');

let controller = new NadController('/dev/ttyUSB0');


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

let sendQuery = function() {
	return new Promise(function(resolve, reject) {
		controller.get('Main.Volume-', function(error, data) {
			if (error) {
				reject(error);
			} else {
				console.log('resolve get:', data);
				resolve(data);
			}
		});
	});
};

let createQuery = function(command) {
	return function() {
		return new Promise(function(resolve, reject) {
			controller.get(command, function(error, data) {
				if (error) {
					reject(error);
				} else {
					console.log('resolve ' + command + ': ', data);
					resolve(data);
				}
			});
		});
	};
};

let paralell = function(promises) {
	return function() {
		return Promise.all(promises.map((promise) => promise()));
	};
};

let timeout = function() {
	return new Promise(function(resolve, reject) {
		setTimeout(resolve, 1000);
	});
};

// open()
// .then(paralell([createQuery('Main.Model?'), createQuery('Main.Source?')]))
// .then((data) => console.log('end: ', data))
// .catch((error) => console.log('ERROR: ', error));

open()
.then(testIsOpened)
.then(close)
.then(testIsClosed)
.then(open)
.then(testIsOpened)
.then(createQuery('Main.Model?'))
.then(createQuery('Main.Tape1=On'))
// .then(createQuery('Main.Source?'))
// .then(createQuery('Main.Model?'))
// .then(createQuery('Main.Source=Video'))
// .then(createQuery('Main.Source?'))
// .then(createQuery('Main.Source=Aux'))
// .then(createQuery('Main.Source?'))
.then((data) => console.log('SUCCESS: ', data))
.catch((error) => console.log('ERROR: ', error));

