const NadController = require('../nadcontroller.js');

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
		})
	})
} 

let close = function() {
	return new Promise(function(resolve, reject) {
		controller.close((error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		})
	})
}

let testIsOpened = function() {
	return new Promise(function(resolve, reject) {
		if (controller.isOpen()) {
			resolve();
		} else {
			reject('Should be open');
		}
	})
} 

let testIsClosed = function() {
	return new Promise(function(resolve, reject) {
		if (!controller.isOpen()) {
			resolve();
		} else {
			reject('Should be closed');
		}
	})
}

let sendQuery = function() {
	return new Promise(function(resolve, reject) {
		controller.get('Main.Model', function(error, data) {
			if (error) {
				reject(error);
			} else {
				console.log('resolve get:', data);
				resolve(data);
			}
		})
	})
}

let timeout = function() {
	return new Promise(function(resolve, reject) {
		setTimeout(resolve, 1000);
	})
}

open()
.then(testIsOpened)
.then(close)
.then(testIsClosed)
.then(open)
.then(testIsOpened)
.then(sendQuery)
.then((data) => console.log('success:', data))
.catch((error) => console.log(error));

/*if (controller.isOpen()) process.exit(1);
console.log('opening /dev/ttyUSB0');
controller.open();
if (!controller.isOpen()) process.exit(1);
controller.close();
if (controller.isOpen()) process.exit(1);
controller.open();
*/

// let model = controller.get('Main.Model?');

//console.log('opening /dev/ttyUSB0fdfd');
//var controller = new NadController('/dev/ttyUSB0fdfd').open();