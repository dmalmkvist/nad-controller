const CommandParser = require('../src/command-parser');

test('Parse Main.Power=On', () => {
	expect(CommandParser.parseCommand('Main.Power=On')).toEqual({
		'name': 'Main.Power',
		'operator': '=',
		'value': 'On'
	});
});

test('Parse Main.Power?', () => {
	expect(CommandParser.parseCommand('Main.Power?')).toEqual({
		'name': 'Main.Power',
		'operator': '?'
	});
});

test('Parse Main.Power-', () => {
	expect(CommandParser.parseCommand('Main.Power-')).toEqual({
		'name': 'Main.Power',
		'operator': '-'
	});
});

test('Parse Main.Power+', () => {
	expect(CommandParser.parseCommand('Main.Power+')).toEqual({
		'name': 'Main.Power',
		'operator': '+'
	});
});

test('Parse Main.Power', () => {
	function parseCommand() {
		CommandParser.parseCommand('Main.Power');
	}
	expect(parseCommand).toThrowError('Missing operation');
});


test('Parse Main.Power=', () => {
	function parseCommand() {
		CommandParser.parseCommand('Main.Power=');
	}
	expect(parseCommand).toThrowError('Value is missing');
});

test('Parse Main.Power?On', () => {
	function parseCommand() {
		CommandParser.parseCommand('Main.Power?On');
	}
	expect(parseCommand).toThrowError('Value is not allowed');
});

test('Parse Main.Power-On', () => {
	function parseCommand() {
		CommandParser.parseCommand('Main.Power-On');
	}
	expect(parseCommand).toThrowError('Value is not allowed');
});

test('Parse Main.Power+ ', () => {
	function parseCommand() {
		CommandParser.parseCommand('Main.Power+ ');
	}
	expect(parseCommand).toThrowError('Value is not allowed');
});
