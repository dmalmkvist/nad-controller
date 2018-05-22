const CommandValidator = require('../src/command-validator');
const Command = require('../src/command');

let commandValidator = new CommandValidator([
		{
			'name':	'Main.Mute',
			'operators': [
				'=',
				'?'
			],
			'values': [
				'On',
				'Off'
			]
		}
	]);

test('Test Main.Mute=On', () => {
	expect(commandValidator.isValid(new Command('Main.Mute', '=', 'On'))).toBe(true);
});

test('Test Main.Mute?', () => {
	expect(commandValidator.isValid(new Command('Main.Mute', '?'))).toBe(true);
});

test('Test Mute.Main=On', () => {
	expect(commandValidator.isValid(new Command('Mute.Main', '=', 'On'))).toBe(false);
});

test('Test Main.Mute-', () => {
	expect(commandValidator.isValid(new Command('Mute.Main', '-'))).toBe(false);
});

test('Test Mute.Main=Not', () => {
	expect(commandValidator.isValid(new Command('Mute.Main', '=', 'Not'))).toBe(false);
});

test('Read commandList file', () => {
	expect(CommandValidator.commandValidatorFromFile('config/nad-c355.json')).toBeInstanceOf(CommandValidator);
})


test('Read commandListFile, missing argument', () => {
	function readCommandListFile() {
		CommandValidator.commandValidatorFromFile();
	}
	expect(readCommandListFile).toThrowError('Must specify file');
});

test('Read commandListFile, missing file', () => {
	function readCommandListFile() {
		CommandValidator.commandValidatorFromFile('non-existing-file.json');
	}
	expect(readCommandListFile).toThrowError('File does not exist');
});
