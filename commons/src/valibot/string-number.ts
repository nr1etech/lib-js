import * as v from 'valibot';
import {m} from '../paraglide/messages.js';
import {Locale} from './locale.js';

/**
 * Accepts a number or a string and converts strings to a number.
 *
 * @param locale - The optional locale to use for error messages.
 */
export function stringNumber(locale?: Locale) {
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => (typeof value === 'string' ? Number(value) : value)),
    v.number(m.v_NaN({}, {locale})),
  );
}

/**
 * Accepts a number or a string, converts strings to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param locale - The optional locale to use for error messages.
 */
export function stringNumberMinimum(min: number | string, locale?: Locale) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => (typeof value === 'string' ? Number(value) : value)),
    v.number(m.v_NaN({}, {locale})),
    v.minValue(min, m.v_atLeast({min}, {locale})),
  );
}

/**
 * Accepts a number or a string, converts the strings to a number, and returns null if the string is empty.
 *
 * @param max - The maximum value.
 * @param locale - The optional locale to use for error messages.
 */
export function stringNumberMaximum(max: number | string, locale?: Locale) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => (typeof value === 'string' ? Number(value) : value)),
    v.number(m.v_NaN({}, {locale})),
    v.maxValue(max, m.v_atMost({max}, {locale})),
  );
}

/**
 * Accepts a number or a string, converts the strings to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @param locale - The optional locale to use for error messages.
 */
export function stringNumberRange(
  min: number | string,
  max: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => (typeof value === 'string' ? Number(value) : value)),
    v.number(m.v_NaN({}, {locale})),
    v.minValue(min, m.v_atLeast({min}, {locale})),
    v.maxValue(max, m.v_atMost({max}, {locale})),
  );
}

/**
 * Accepts a number or a string and trims strings and converts strings to a number.
 *
 * @param locale - The optional locale to use for error messages.
 */
export function trimStringNumber(locale?: Locale) {
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.number(m.v_NaN({}, {locale})),
  );
}

/**
 * Accepts a number or a string and trims strings and converts strings to a number and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param locale - The optional locale to use for error messages.
 */
export function trimStringNumberMinimum(min: number | string, locale?: Locale) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.number(m.v_NaN({}, {locale})),
    v.minValue(min, m.v_atLeast({min}, {locale})),
  );
}

/**
 * Accepts a number or a string and trims strings and converts strings to a number and returns null if the string is empty.
 *
 * @param max - The maximum value.
 * @param locale - The optional locale to use for error messages.
 */
export function trimStringNumberMaximum(max: number | string, locale?: Locale) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.number(m.v_NaN({}, {locale})),
    v.maxValue(max, m.v_atMost({max}, {locale})),
  );
}

/**
 * Accepts a number or a string and trims strings and converts strings to a number and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @param locale - The optional locale to use for error messages.
 */
export function trimStringNumberRange(
  min: number | string,
  max: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.number(m.v_NaN({}, {locale})),
    v.minValue(min, m.v_atLeast({min}, {locale})),
    v.maxValue(max, m.v_atMost({max}, {locale})),
  );
}

/**
 * Accepts a number or a string, trims strings, converts strings to a number, and returns null if the string is empty.
 *
 * @param locale - The optional locale to use for error messages.
 */
export function stringNumberEmptyNull(locale?: Locale) {
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      return typeof value === 'string' ? Number(value) : value;
    }),
    v.nullable(v.number(m.v_NaN({}, {locale}))),
  );
}

/**
 * Accepts a number or a string, trims strings, converts strings to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param locale - The optional locale to use for error messages.
 */
export function stringNumberMinimumEmptyNull(
  min: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      return typeof value === 'string' ? Number(value) : value;
    }),
    v.nullable(
      v.pipe(
        v.number(m.v_NaN({}, {locale})),
        v.minValue(min, m.v_atLeast({min}, {locale})),
      ),
    ),
  );
}

/**
 * Accepts a number or a string, trims strings, converts strings to a number, and returns null if the string is empty.
 *
 * @param max - The maximum value.
 * @param locale - The optional locale to use for error messages.
 */
export function stringNumberMaximumEmptyNull(
  max: number | string,
  locale?: Locale,
) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      return typeof value === 'string' ? Number(value) : value;
    }),
    v.nullable(
      v.pipe(
        v.number(m.v_NaN({}, {locale})),
        v.maxValue(max, m.v_atMost({max}, {locale})),
      ),
    ),
  );
}

/**
 * Accepts a number or a string, trims strings, converts strings to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @param locale - The optional locale to use for error messages.
 */
export function stringNumberRangeEmptyNull(
  min: number | string,
  max: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      return typeof value === 'string' ? Number(value) : value;
    }),
    v.nullable(
      v.pipe(
        v.number(m.v_NaN({}, {locale})),
        v.minValue(min, m.v_atLeast({min}, {locale})),
        v.maxValue(max, m.v_atMost({max}, {locale})),
      ),
    ),
  );
}

/**
 * Accepts a number or a string, trims strings, converts the string to a number, and returns null if the string is empty.
 *
 * @param locale - The optional locale to use for error messages.
 */
export function trimStringNumberEmptyNull(locale?: Locale) {
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.nullable(v.number(m.v_NaN({}, {locale}))),
  );
}

/**
 * Accepts a number or a string, trims strings, converts the string to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param locale - The optional locale to use for error messages.
 */
export function trimStringNumberMinimumEmptyNull(
  min: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.nullable(
      v.pipe(
        v.number(m.v_NaN({}, {locale})),
        v.minValue(min, m.v_atLeast({min}, {locale})),
      ),
    ),
  );
}

/**
 * Accepts a number or a string, trims strings, converts the string to a number, and returns null if the string is empty.
 *
 * @param max - The maximum value.
 * @param locale - The optional locale to use for error messages.
 */
export function trimStringNumberMaximumEmptyNull(
  max: number | string,
  locale?: Locale,
) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.nullable(
      v.pipe(
        v.number(m.v_NaN({}, {locale})),
        v.maxValue(max, m.v_atMost({max}, {locale})),
      ),
    ),
  );
}

/**
 * Accepts a number or a string, trims strings, converts the string to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @param locale - The optional locale to use for error messages.
 */
export function trimStringNumberRangeEmptyNull(
  min: number | string,
  max: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.nullable(
      v.pipe(
        v.number(m.v_NaN({}, {locale})),
        v.minValue(min, m.v_atLeast({min}, {locale})),
        v.maxValue(max, m.v_atMost({max}, {locale})),
      ),
    ),
  );
}
