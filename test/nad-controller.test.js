const NadController = require('../index').NadController;
const MODELS = require('../index').MODELS;

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
const mockGetReadCommands = jest.fn();
const CommandValidator = require.requireActual('../src/command-validator');
CommandValidator.commandValidatorFromFile = jest.fn(() => {
  return {
    isValid: mockCommandValidatorIsValid,
    getReadCommands: mockGetReadCommands
  };
});

beforeEach(() => {
  mockCommandValidatorIsValid.mockClear();
});

const nadController = new NadController('/path/to/serial-port', {
  model: MODELS.C355
});

test('Creating NadController', () => {
  expect(new NadController('/path/to/serial-port', { model: NadController.MODELS.C355 })).toBeInstanceOf(NadController);
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

test('getAllStates', (done) => {
  mockCommandValidatorIsValid.mockReturnValue(true);
  mockTaskManagerAdd.mockImplementationOnce((cmd, cb) => cb(null, {name: 'alpha', value: 'foo'}));
  mockTaskManagerAdd.mockImplementationOnce((cmd, cb) => cb(null, {name: 'beta', value: 'bar'}));
  mockGetReadCommands.mockReturnValue(['alpha', 'beta']);
  function callback(error, data) {
    expect(data).toEqual([{name: 'alpha', value: 'foo'}, {name: 'beta', value: 'bar'}]);
    done();
  }

  nadController.getAllStates(callback);
});

test('getAllStates wiht error', (done) => {
  mockCommandValidatorIsValid.mockReturnValue(true);
  mockTaskManagerAdd.mockImplementationOnce((cmd, cb) => cb(null, {name: 'alpha', value: 'foo'}));
  mockTaskManagerAdd.mockImplementationOnce((cmd, cb) => cb('error'));
  mockGetReadCommands.mockReturnValue(['alpha', 'beta']);
  function callback(error, data) {
    expect(error).toEqual('error');
    expect(data).toBe(undefined);
    done();
  }

  nadController.getAllStates(callback);
});
