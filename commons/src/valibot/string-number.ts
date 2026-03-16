import * as v from 'valibot';

/**
 * Accepts a number or a string and converts strings to a number.
 */
export function stringNumber() {
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => (typeof value === 'string' ? Number(value) : value)),
    v.number(),
  );
}

/**
 * Accepts a number or a string, converts strings to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 */
export function stringNumberMinimum(min: number | string) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => (typeof value === 'string' ? Number(value) : value)),
    v.minValue(min, `Must be at least ${min}`),
  );
}

/**
 * Accepts a number or a string, converts the strings to a number, and returns null if the string is empty.
 *
 * @param max - The maximum value.
 */
export function stringNumberMaximum(max: number | string) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => (typeof value === 'string' ? Number(value) : value)),
    v.maxValue(max, `May be at most ${max}`),
  );
}

/**
 * Accepts a number or a string, converts the strings to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 */
export function stringNumberRange(min: number | string, max: number | string) {
  if (typeof min === 'string') min = Number(min);
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => (typeof value === 'string' ? Number(value) : value)),
    v.minValue(min, `Must be at least ${min}`),
    v.maxValue(max, `May be at most ${max}`),
  );
}

/**
 * Accepts a number or a string and trims strings and converts strings to a number.
 */
export function trimStringNumber() {
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.number(),
  );
}

/**
 * Accepts a number or a string and trims strings and converts strings to a number and returns null if the string is empty.
 *
 * @param min - The minimum value.
 */
export function trimStringNumberMinimum(min: number | string) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.minValue(min, `Must be at least ${min}`),
    v.number(),
  );
}

/**
 * Accepts a number or a string and trims strings and converts strings to a number and returns null if the string is empty.
 *
 * @param max - The maximum value.
 */
export function trimStringNumberMaximum(max: number | string) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.maxValue(max, `May be at most ${max}`),
    v.number(),
  );
}

/**
 * Accepts a number or a string and trims strings and converts strings to a number and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 */
export function trimStringNumberRange(
  min: number | string,
  max: number | string,
) {
  if (typeof min === 'string') min = Number(min);
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.minValue(min, `Must be at least ${min}`),
    v.maxValue(max, `May be at most ${max}`),
    v.number(),
  );
}

/**
 * Accepts a number or a string, trims strings, converts strings to a number, and returns null if the string is empty.
 */
export function stringNumberEmptyNull() {
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      return typeof value === 'string' ? Number(value) : value;
    }),
    v.nullable(v.number()),
  );
}

/**
 * Accepts a number or a string, trims strings, converts strings to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 */
export function stringNumberMinimumEmptyNull(min: number | string) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      return typeof value === 'string' ? Number(value) : value;
    }),
    v.nullable(v.pipe(v.number(), v.minValue(min, `Must be at leat ${min}`))),
  );
}

/**
 * Accepts a number or a string, trims strings, converts strings to a number, and returns null if the string is empty.
 *
 * @param max - The maximum value.
 */
export function stringNumberMaximumEmptyNull(max: number | string) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      return typeof value === 'string' ? Number(value) : value;
    }),
    v.nullable(v.pipe(v.number(), v.maxValue(max, `Must be at most ${max}`))),
  );
}

/**
 * Accepts a number or a string, trims strings, converts strings to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 */
export function stringNumberRangeEmptyNull(
  min: number | string,
  max: number | string,
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
        v.number(),
        v.minValue(min, `Must be at leat ${min}`),
        v.maxValue(max, `May be at most ${max}`),
      ),
    ),
  );
}

/**
 * Accepts a number or a string, trims strings, converts the string to a number, and returns null if the string is empty.
 */
export function trimStringNumberEmptyNull() {
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.nullable(v.number()),
  );
}

/**
 * Accepts a number or a string, trims strings, converts the string to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 */
export function trimStringNumberMinimumEmptyNull(min: number | string) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.nullable(v.pipe(v.number(), v.minValue(min, `Must be at leat ${min}`))),
  );
}

/**
 * Accepts a number or a string, trims strings, converts the string to a number, and returns null if the string is empty.
 *
 * @param max - The maximum value.
 */
export function trimStringNumberMaximumEmptyNull(max: number | string) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.string(), v.number()]),
    v.transform((value) => {
      if (value === '') return null;
      if (typeof value === 'string') return Number(value.trim());
      return value;
    }),
    v.nullable(v.pipe(v.number(), v.maxValue(max, `May be at most ${max}`))),
  );
}

/**
 * Accepts a number or a string, trims strings, converts the string to a number, and returns null if the string is empty.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 */
export function trimStringNumberRangeEmptyNull(
  min: number | string,
  max: number | string,
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
        v.number(),
        v.minValue(min, `Must be at leat ${min}`),
        v.maxValue(max, `May be at most ${max}`),
      ),
    ),
  );
}
