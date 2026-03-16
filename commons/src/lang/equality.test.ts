import {test, expect} from 'vitest';
import {deepEquals} from './equality.js';

test('Test deepEquals', () => {
  expect(deepEquals('bar', 'bar')).toBeTruthy();
  expect(deepEquals('bar', 'baz')).toBeFalsy();
  expect(
    deepEquals({bar: 'baz', foo: 'bar'}, {foo: 'bar', bar: 'baz'}),
  ).toBeTruthy();
  expect(deepEquals('bar', 'baz')).toBeFalsy();
  expect(deepEquals(['bar', 'baz'], ['baz', 'bar'])).toBeFalsy();
  expect(deepEquals(['bar', 'baz'], ['bar', 'baz', 'foo'])).toBeFalsy();
  expect(deepEquals('bar', undefined)).toBeFalsy();
  expect(deepEquals('bar', null)).toBeFalsy();
  expect(deepEquals(undefined, 'bar')).toBeFalsy();
  expect(deepEquals(null, 'baz')).toBeFalsy();
});
