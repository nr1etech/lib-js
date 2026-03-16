import {test, expect} from 'vitest';
import {
  betweenValues,
  email,
  number,
  maxLength,
  maxValue,
  minLength,
  minValue,
  notBlank,
  notEmpty,
  notNull,
  validString,
  isNotNull,
  isNotEmpty,
  isNotBlank,
  match,
  isMatch,
  isEmail,
  isMaxLength,
  isMinLength,
  isNumber,
  isMinValue,
  isMaxValue,
  isBetweenValues,
  isValidString,
} from './validators.js';

test('Test isNotNull', () => {
  expect(isNotNull('bar')).toBeTruthy();
  expect(isNotNull(null)).toBeFalsy();
  expect(isNotNull(undefined)).toBeFalsy();
});

test('Test notNull', () => {
  notNull('foo', 'bar');
  expect(() => notNull('foo', null)).toThrow(
    'foo may not be null or undefined',
  );
  expect(() => notNull('foo', undefined)).toThrow(
    'foo may not be null or undefined',
  );
});

test('Test isNotEmpty', () => {
  expect(isNotEmpty('bar')).toBeTruthy();
  expect(isNotEmpty('')).toBeFalsy();
  expect(isNotEmpty(null)).toBeFalsy();
  expect(isNotEmpty(undefined)).toBeFalsy();
});

test('Test notEmpty', () => {
  notEmpty('foo', 'bar');
  expect(() => notEmpty('foo', '')).toThrow('foo may not be empty');
  expect(() => notEmpty('foo', null)).toThrow('foo may not be empty');
  expect(() => notEmpty('foo', undefined)).toThrow('foo may not be empty');
});

test('Test isNotBlank', () => {
  expect(isNotBlank('bar')).toBeTruthy();
  expect(isNotBlank(' ')).toBeFalsy();
  expect(isNotBlank('')).toBeFalsy();
  expect(isNotBlank(null)).toBeFalsy();
  expect(isNotBlank(undefined)).toBeFalsy();
});

test('Test notBlank', () => {
  notBlank('foo', 'bar');
  expect(() => notBlank('foo', ' ')).toThrow('foo may not be blank');
  expect(() => notBlank('foo', '')).toThrow('foo may not be blank');
  expect(() => notBlank('foo', null)).toThrow('foo may not be blank');
  expect(() => notBlank('foo', undefined)).toThrow('foo may not be blank');
});

test('Test isMatch', () => {
  expect(isMatch(/bar/, 'bar')).toBeTruthy();
  expect(isMatch(/bar/, null)).toBeTruthy();
  expect(isMatch(/bar/, undefined)).toBeTruthy();
  expect(isMatch(/bar/, 'baz')).toBeFalsy();
});

test('Test match', () => {
  match('foo', /bar/, 'bar');
  match('foo', /bar/, null);
  match('foo', /bar/, undefined);
  expect(() => match('foo', /bar/, 'baz')).toThrow('foo must match /bar/');
});

test('Test isEmail', () => {
  expect(isEmail('test@example.com')).toBeTruthy();
  expect(isEmail(null)).toBeTruthy();
  expect(isEmail(undefined)).toBeTruthy();
  expect(isEmail('test')).toBeFalsy();
});

test('Test email', () => {
  email('foo', 'test@example.com');
  email('foo', null);
  email('foo', undefined);
  expect(() => email('foo', 'test')).toThrow(
    'foo is not a valid email address',
  );
});

test('Test isMaxLength', () => {
  const arr: string[] = [];
  arr.push('a', 'b', 'c');
  expect(isMaxLength(3, 'bar')).toBeTruthy();
  expect(isMaxLength(3, null)).toBeTruthy();
  expect(isMaxLength(3, undefined)).toBeTruthy();
  expect(isMaxLength(3, arr)).toBeTruthy();
  expect(isMaxLength(2, 'baz')).toBeFalsy();
  expect(isMaxLength(2, arr)).toBeFalsy();
});

test('Test maxLength', () => {
  const arr: string[] = [];
  arr.push('a', 'b', 'c');
  maxLength('foo', 3, 'bar');
  maxLength('foo', 3, null);
  maxLength('foo', 3, undefined);
  maxLength('foo', 3, arr);
  expect(() => maxLength('foo', 2, 'baz')).toThrow(
    'length of foo may not exceed 2',
  );
  expect(() => maxLength('foo', 2, arr)).toThrow(
    'length of foo may not exceed 2',
  );
});

test('Test isMinLength', () => {
  const arr: string[] = [];
  arr.push('a', 'b', 'c');
  expect(isMinLength(3, 'bar')).toBeTruthy();
  expect(isMinLength(3, null)).toBeTruthy();
  expect(isMinLength(3, undefined)).toBeTruthy();
  expect(isMinLength(3, arr)).toBeTruthy();
  expect(isMinLength(4, 'baz')).toBeFalsy();
  expect(isMinLength(4, arr)).toBeFalsy();
});

test('Test minLength', () => {
  const arr: string[] = [];
  arr.push('a', 'b', 'c');
  minLength('foo', 3, 'bar');
  minLength('foo', 3, null);
  minLength('foo', 3, undefined);
  minLength('foo', 3, arr);
  expect(() => minLength('foo', 4, 'baz')).toThrow(
    'length of foo may not be less than 4',
  );
  expect(() => minLength('foo', 4, arr)).toThrow(
    'length of foo may not be less than 4',
  );
});

test('Test isNumber', () => {
  expect(isNumber(1)).toBeTruthy();
  expect(isNumber('1')).toBeTruthy();
  expect(isNumber(null)).toBeTruthy();
  expect(isNumber(undefined)).toBeTruthy();
  expect(isNumber('bar')).toBeFalsy();
});

test('Test number', () => {
  number('foo', 1);
  number('foo', '1');
  number('foo', null);
  number('foo', undefined);
  expect(() => number('foo', 'bar')).toThrow('foo is not a number');
});

test('Test isMinValue', () => {
  expect(isMinValue(1, 2)).toBeTruthy();
  expect(isMinValue(1, '2')).toBeTruthy();
  expect(isMinValue(1, null)).toBeTruthy();
  expect(isMinValue(1, undefined)).toBeTruthy();
  expect(isMinValue(2, 1)).toBeFalsy();
});

test('Test minValue', () => {
  minValue('foo', 1, 2);
  minValue('foo', 1, '2');
  minValue('foo', 1, null);
  minValue('foo', 1, undefined);
  expect(() => minValue('foo', 2, 1)).toThrow('foo may not be less than 2');
});

test('Test isMaxValue', () => {
  expect(isMaxValue(2, 1)).toBeTruthy();
  expect(isMaxValue(2, '1')).toBeTruthy();
  expect(isMaxValue(2, null)).toBeTruthy();
  expect(isMaxValue(2, undefined)).toBeTruthy();
  expect(isMaxValue(1, 2)).toBeFalsy();
});

test('Test maxValue', () => {
  maxValue('foo', 2, 1);
  maxValue('foo', 2, '1');
  maxValue('foo', 2, null);
  maxValue('foo', 2, undefined);
  expect(() => maxValue('foo', 1, 2)).toThrow('foo may not be greater than 1');
});

test('Test isBetweenValues', () => {
  expect(isBetweenValues(1, 3, 2)).toBeTruthy();
  expect(isBetweenValues(1, 3, '2')).toBeTruthy();
  expect(isBetweenValues(1, 3, null)).toBeTruthy();
  expect(isBetweenValues(1, 3, undefined)).toBeTruthy();
  expect(isBetweenValues(1, 3, 4)).toBeFalsy();
});

test('Test betweenValues', () => {
  betweenValues('foo', 1, 3, 2);
  betweenValues('foo', 1, 3, '2');
  betweenValues('foo', 1, 3, null);
  betweenValues('foo', 1, 3, undefined);
  expect(() => betweenValues('foo', 1, 3, 4)).toThrow(
    'foo must be between 1 and 3',
  );
});

test('Test isValidString', () => {
  expect(isValidString({required: true}, 'bar')).toBeTruthy();
  expect(isValidString({required: true}, ' ')).toBeTruthy();
  expect(isValidString({required: true}, '')).toBeTruthy();
  expect(isValidString({required: false}, null)).toBeTruthy();
  expect(isValidString({required: false}, undefined)).toBeTruthy();
  expect(isValidString({required: true}, null)).toBeFalsy();
  expect(isValidString({required: true}, undefined)).toBeFalsy();
});

test('Test validString', () => {
  validString('foo', {required: true}, 'bar');
  validString('foo', {required: true}, ' ');
  validString('foo', {required: true}, '');
  validString('foo', {required: false}, null);
  validString('foo', {required: false}, undefined);
  expect(() => validString('foo', {required: true}, null)).toThrow(
    'foo may not be null or undefined',
  );
  expect(() => validString('foo', {required: true}, undefined)).toThrow(
    'foo may not be null or undefined',
  );
});
