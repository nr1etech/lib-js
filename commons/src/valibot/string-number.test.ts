import {test, expect} from 'vitest';
import * as v from 'valibot';
import {
  stringNumber,
  stringNumberRange,
  stringNumberRangeEmptyNull,
} from './string-number.js';

test('Test stringNumber()', () => {
  let parsed = v.safeParse(stringNumber(), '123');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(stringNumber(), ' 123 ');
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
  parsed = v.safeParse(stringNumber(), null);
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumber(), undefined);
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumber(), '');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumber(), ' ');
  expect(parsed.success).toBe(false);
});

test('Test stringNumberRange()', () => {
  let parsed = v.safeParse(stringNumberRange(1, 1000), '123');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(stringNumberRange(1, 1000), ' 123 ');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(stringNumberRange(1, 1000), 123);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(stringNumberRange(1, 1000), '123.45');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123.45);
  parsed = v.safeParse(stringNumberRange(1, 1000), 123.45);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123.45);
  parsed = v.safeParse(stringNumberRange(1, 1000), '0');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumberRange(1, 1000), -1);
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumberRange(1, 1000), null);
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumberRange(1, 1000), undefined);
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumberRange(1, 1000), '');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumberRange(1, 1000), ' ');
  expect(parsed.success).toBe(false);
});

test('Test stringNumberRangeEmptyNull()', () => {
  let parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), '123');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), ' 123 ');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), 123);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123);
  parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), '123.45');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123.45);
  parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), 123.45);
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBe(123.45);
  parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), '0');
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), -1);
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), null);
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), undefined);
  expect(parsed.success).toBe(false);
  parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), '');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBeNull();
  parsed = v.safeParse(stringNumberRangeEmptyNull(1, 1000), ' ');
  expect(parsed.success).toBe(true);
  expect(parsed.output).toBeNull();
});
