const fs = require('fs');
const path = require('path');

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
	constructor(_availableCommands) {

		this._availableCommands = _availableCommands;
	}

	/*
	 * Accept Command object
	 */
	isValid(command) {

		let commandDescription = this._availableCommands.find((commandDescription) => {
			return commandDescription.name === command.name;
		});

		if (!commandDescription) {
			return false;
		}

		let operator = commandDescription.operators.find((operator) => {
			return operator === command.operator;
		});

		if (!operator) {
			return false;
		}

		let value = commandDescription.values.find((value) => {
			return value === command.value;
		});

		if (operator === '=' && !value) {
			return false;
		}

		return true;
	}

	getReadCommands() {
		return this._availableCommands
			.filter((command) => command.operators.indexOf('?') >= 0)
			.map((command) => command.name);
	}

	static commandValidatorFromFile(commandListFile) {

		if (!commandListFile) {
			throw 'Must specify file path argument.';
		}

		let moduleLocalPath = path.join(__dirname, commandListFile);
		if (fs.existsSync(moduleLocalPath)) {
			commandListFile = moduleLocalPath;
		} else if (!fs.existsSync(commandListFile)) {
			throw 'File does not exist: ' + commandListFile;
		}

		let fileContent = fs.readFileSync(commandListFile, 'utf8');
		let json = JSON.parse(fileContent);
		return new CommandValidator(json);
	}
};