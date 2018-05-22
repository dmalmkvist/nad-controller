
/*
 * Represent a command that can be sent to the controller
 * or returned by the controller.
 */
module.exports = class Command {
	constructor(name, operator, value) {

		if (operator === '=' && !value) {
			throw 'Value is missing for that operation.';
		}

		if (operator !== '=' && value) {
			throw 'Value is not allowed for that operation.';
		}

		this._name = name;
		this._operator = operator;
		if (value) {
			this._value = value;
		}
	}

	get name() {
		return this._name;
	}

	get operator() {
		return this._operator;
	}

	get value() {
		return this._value;
	}

	/*
	 * Expects command as "Main.Power=Off" or "Main.Power?"
	 * Returns a parsed command like:
	 * {
	 *   'name': 'Main.Power',
	 *   'operator': '=',
	 *   'value': 'On'
	 * }
	 */
	static parseCommand(command) {

		if (!command) {
			throw 'Missing command.';
		}

		let parts = command.split(/([=?+-])/);
		if (parts.length !== 3) {
			throw 'Missing operation.';
		}

		let name = parts[0];
		let operator = parts[1];
		let value = parts[2];

		return new Command(name, operator, value);
	}
};