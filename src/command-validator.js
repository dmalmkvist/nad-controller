
module.exports = class CommandValidator {

	/*
	 * Accepts a array of command descriptions available.
	 *
	 * A command description is represented like this:
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

	/*
	 * Accept Command object
	 */
	isValid(command) {

		let commandDescription = this.availableCommand.find((commandDescription) => {
			return commandDescription.name === command.name;
		});

		if (!commandDescription) {
			return false;
		}

		let operator = commandDescription.operators.find((operator) => {
			return operator === command.operator;
		})

		if (!operator) {
			return false;
		}

		let value = commandDescription.values.find((value) => {
			return value === command.value;
		})

		if (!value) {
			return false;
		}

		return true;
	}
};