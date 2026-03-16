import {test, expect} from 'vitest';
import * as v from 'valibot';
import {stringNumber, trimStringNumberRange} from './string-number.js';

test('Test stringNumber()', () => {
  let parsed = v.safeParse(stringNumber(), '123');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(stringNumber(), 123);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(stringNumber(), '0.75');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(0.75);
  parsed = v.safeParse(stringNumber(), 0.75);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(0.75);
  parsed = v.safeParse(stringNumber(), '-1');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(-1);
});

test('Test trimStringNumberRange()', () => {
  let parsed = v.safeParse(trimStringNumberRange(1, 1000), '123');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(trimStringNumberRange(1, 1000), 123);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(trimStringNumberRange(1, 1000), '123.45');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123.45);
  parsed = v.safeParse(trimStringNumberRange(1, 1000), 123.45);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123.45);
  parsed = v.safeParse(trimStringNumberRange(1, 1000), '0');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(trimStringNumberRange(1, 1000), -1);
  expect(parsed.success).toBe(false);
});
