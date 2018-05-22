const Command = require('../src/command');

test('Parse Main.Power=On', () => {
	expect(Command.parseCommand('Main.Power=On')).toEqual(new Command('Main.Power', '=', 'On'));
});

test('Parse Main.Power?', () => {
	expect(Command.parseCommand('Main.Power?')).toEqual(new Command('Main.Power', '?'));
});

test('Parse Main.Power-', () => {
	expect(Command.parseCommand('Main.Power-')).toEqual(new Command('Main.Power', '-'));
});

test('Parse Main.Power+', () => {
	expect(Command.parseCommand('Main.Power+')).toEqual(new Command('Main.Power', '+'));
});

test('Parse Main.Power', () => {
	function parseCommand() {
		Command.parseCommand('Main.Power');
	}
	expect(parseCommand).toThrowError('Missing operation');
});

test('Parse Main.Power=', () => {
	function parseCommand() {
		Command.parseCommand('Main.Power=');
	}
	expect(parseCommand).toThrowError('Value is missing');
});

test('Parse Main.Power?On', () => {
	function parseCommand() {
		Command.parseCommand('Main.Power?On');
	}
	expect(parseCommand).toThrowError('Value is not allowed');
});

test('Parse Main.Power-On', () => {
	function parseCommand() {
		Command.parseCommand('Main.Power-On');
	}
	expect(parseCommand).toThrowError('Value is not allowed');
});

test('Parse Main.Power+ ', () => {
	function parseCommand() {
		Command.parseCommand('Main.Power+ ');
	}
	expect(parseCommand).toThrowError('Value is not allowed');
});

test('Command.toString() Main.Power=On', () => {
	expect(new Command('Main.Power', '=', 'On').toString()).toEqual('Main.Power=On');
})

test('Command.toString() Main.Power?', () => {
	expect(new Command('Main.Power', '?').toString()).toEqual('Main.Power?');
})