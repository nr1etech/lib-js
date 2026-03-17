import {expect, test} from 'vitest';
import * as v from 'valibot';
import {
  numberString,
  numberStringEmptyNull,
  numberStringFixed,
  numberStringFixedEmptyNull,
} from './number-string.js';

test('Test numberString()', () => {
  let parsed = v.safeParse(numberString(), '1');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1');
  parsed = v.safeParse(numberString(), 1);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1');
  parsed = v.safeParse(numberString(), '1.234');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.234');
  parsed = v.safeParse(numberString(), 1.234);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.234');
  parsed = v.safeParse(numberString(), ' 1.234 ');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.234');
  parsed = v.safeParse(numberString(), ' ');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(numberString(), '');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(numberString(), 'x');
  expect(parsed.success).toBe(false);
});

test('Test numberStringEmptyNull()', () => {
  let parsed = v.safeParse(numberStringEmptyNull(), '1');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1');
  parsed = v.safeParse(numberStringEmptyNull(), 1);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1');
  parsed = v.safeParse(numberStringEmptyNull(), '1.234');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.234');
  parsed = v.safeParse(numberStringEmptyNull(), 1.234);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.234');
  parsed = v.safeParse(numberStringEmptyNull(), ' 1.234 ');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.234');
  parsed = v.safeParse(numberStringEmptyNull(), ' ');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBeNull();
  parsed = v.safeParse(numberStringEmptyNull(), '');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBeNull();
  parsed = v.safeParse(numberStringEmptyNull(), 'x');
  expect(parsed.success).toBe(false);
});

test('Test numberStringFixed()', () => {
  let parsed = v.safeParse(numberStringFixed(2), '1');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.00');
  parsed = v.safeParse(numberStringFixed(2), 1);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.00');
  parsed = v.safeParse(numberStringFixed(2), '1.23');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.23');
  parsed = v.safeParse(numberStringFixed(2), 1.23);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.23');
  parsed = v.safeParse(numberStringFixed(2), '1.234');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(numberStringFixed(2), 1.234);
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(numberStringFixed(2), ' ');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(numberStringFixed(2), '');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(numberStringFixed(2), 'x');
  expect(parsed.success).toBe(false);
});

test('Test numberStringFixedEmptyNull()', () => {
  let parsed = v.safeParse(numberStringFixedEmptyNull(2), '1');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.00');
  parsed = v.safeParse(numberStringFixedEmptyNull(2), 1);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.00');
  parsed = v.safeParse(numberStringFixedEmptyNull(2), '1.23');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.23');
  parsed = v.safeParse(numberStringFixedEmptyNull(2), 1.23);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe('1.23');
  parsed = v.safeParse(numberStringFixedEmptyNull(2), '1.234');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(numberStringFixedEmptyNull(2), 1.234);
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(numberStringFixedEmptyNull(2), ' ');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBeNull();
  parsed = v.safeParse(numberStringFixedEmptyNull(2), '');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBeNull();
  parsed = v.safeParse(numberStringFixedEmptyNull(2), 'x');
  expect(parsed.success).toBe(false);
});
