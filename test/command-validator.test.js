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

test('Test Mute.Main=On', () => {
	expect(commandValidator.isValid(new Command('Mute.Main', '=', 'On'))).toBe(false);
});

test('Test Main.Mute-', () => {
	expect(commandValidator.isValid(new Command('Mute.Main', '-'))).toBe(false);
});

test('Test Mute.Main=Not', () => {
	expect(commandValidator.isValid(new Command('Mute.Main', '=', 'Not'))).toBe(false);
});
