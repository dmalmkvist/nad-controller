const NadController = require('../src/nad-controller');

const SerialPort = require('serialport');
const PortGate = require('../src/portgate');
const TaskManager = require('../src/task-manager');
const Command = require('../src/command');

jest.mock('serialport');

const mockTaskManagerAdd = jest.fn();
jest.mock('../src/task-manager', () => {
  return jest.fn().mockImplementation(() => {
    return {
      add: mockTaskManagerAdd,
      on: jest.fn()
    };
  });
});

const mockCommandValidatorIsValid = jest.fn();
const CommandValidator = require.requireActual('../src/command-validator');
CommandValidator.commandValidatorFromFile = jest.fn(() => {
  return {
    isValid: mockCommandValidatorIsValid
  };
});

beforeEach(() => {
  mockCommandValidatorIsValid.mockClear();
});

const nadController = new NadController('/path/to/serial-port', 'path-to-command-list-file');

test('Creating NadController', () => {
  expect(new NadController('/path/to/serial-port', 'path-to-command-list-file')).toBeInstanceOf(NadController);
});

test('Invalid read command', () => {
  mockCommandValidatorIsValid.mockReturnValueOnce(false);
  function parseCommand() {
    nadController.get('<Some command>');
  }
  expect(parseCommand).toThrowError('Invalid command');
});

test('Invalid write command', () => {
  mockCommandValidatorIsValid.mockReturnValueOnce(false);
  function parseCommand() {
    nadController.get('<Some command>');
  }
  expect(parseCommand).toThrowError('Invalid command');
});

test('Invalid increment command', () => {
  mockCommandValidatorIsValid.mockReturnValueOnce(false);
  function parseCommand() {
    nadController.get('<Some command>');
  }
  expect(parseCommand).toThrowError('Invalid command');
});

test('Invalid decrement command', () => {
  mockCommandValidatorIsValid.mockReturnValueOnce(false);
  function parseCommand() {
    nadController.get('<Some command>');
  }
  expect(parseCommand).toThrowError('Invalid command');
});

test('Read command', (done) => {
  mockCommandValidatorIsValid.mockReturnValueOnce(true);
  mockTaskManagerAdd.mockImplementationOnce((cmd, cb) => cb('test'));
  function callback(data) {
    expect(data).toEqual('test');
    done();
  }

  nadController.get('<some command>', callback);
});
