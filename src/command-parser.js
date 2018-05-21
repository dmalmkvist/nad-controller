
module.exports = class CommandParser {

	/*
	 * Accepts a array of command available togehter with what options
	 * and values are allowed.
	 *
	 * A command is represented like this:
	 *
	 *	{
	 *		'name':'<command name>',
	 *		'operators': [
	 *			'<operator>'
	 *		],
	 *		'values': [
	 *			'<possible value>'
	 *		]
	 *	},
	 *
	 * For example:
	 *	{
	 *		'name':'Main.Power',
	 *		'operators': [
	 *			'=',
	 *			'+',
	 *			'-',
	 *			'?'
	 *		],
	 *		'values': [
	 *			'On',
	 *			'Off'
	 *		]
	 *	},
	 */
	constructor(availableCommand) {

		this.availableCommand = availableCommand;
	}

	validateCommand(command) {

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

		if (operator !== '=' && value) {
			throw 'Value is not allowed for that operation.';
		}

		if (operator === '=' && !value) {
			throw 'Value is missing for that operation.';
		}

		let response = {
			'name': parts[0],
			'operator': parts[1]
		};

		if (value) {
			response.value = value;
		}

		return response;
	}
};