import * as v from 'valibot';
import {Locale} from './locale.js';
import {m} from '../paraglide/messages.js';

export function numberString(locale?: Locale) {
  return v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => {
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'string' && value.trim() !== '')
        return Number(value.trim()).toString();
      return value;
    }),
    v.pipe(v.string(), v.regex(/^-?\d+(\.\d+)?$/, m.v_NaN({}, {locale}))),
  );
}

export function numberStringEmptyNull(locale?: Locale) {
  return v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => {
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') return null;
        return Number(trimmed).toString();
      }
      return value;
    }),
    v.union([
      v.null(),
      v.pipe(v.string(), v.regex(/^-?\d+(\.\d+)?$/, m.v_NaN({}, {locale}))),
    ]),
  );
}

export function numberStringFixed(fractionDigits: number, locale?: Locale) {
  return v.pipe(
    v.union([v.number(), v.string()]),
    // 1. Normalize early (so we can validate consistently)
    v.transform((value) => {
      if (typeof value === 'number') return value;
      const trimmed = value.trim();
      if (trimmed === '') return NaN;
      return Number(trimmed);
    }),
    // 2. Validate it's a valid number
    v.check((value) => Number.isFinite(value), m.v_NaN({}, {locale})),
    // 3. Validate decimal precision separately
    v.check(
      (value) => {
        const shifted = value * 10 ** fractionDigits;
        return Math.abs(shifted - Math.trunc(shifted)) < Number.EPSILON;
      },
      m.v_overPrecision({fractionDigits}, {locale}),
    ),
    // 4. Format
    v.transform((value) => value.toFixed(fractionDigits)),
    v.string(),
  );
}

export function numberStringFixedEmptyNull(
  fractionDigits: number,
  locale?: Locale,
) {
  return v.pipe(
    v.union([v.number(), v.string()]),
    // 1. Normalize early (so we can validate consistently)
    v.transform((value) => {
      if (typeof value === 'number') return value;
      const trimmed = value.trim();
      if (trimmed === '') return null;
      return Number(trimmed);
    }),
    v.union([
      v.null(),
      v.pipe(
        v.number(),
        v.check((value) => Number.isFinite(value), m.v_NaN({}, {locale})),
        v.check(
          (value) => {
            const shifted = value * 10 ** fractionDigits;
            return Math.abs(shifted - Math.trunc(shifted)) < Number.EPSILON;
          },
          m.v_overPrecision({fractionDigits}, {locale}),
        ),
        v.transform((value) => value.toFixed(fractionDigits)),
        v.string(),
      ),
    ]),
  );
}

export function numberStringMinimum(min: number | string, locale?: Locale) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && value.trim() !== '') {
        return Number(value.trim());
      }
      return value;
    }),
    v.pipe(
      v.number(),
      v.minValue(min, m.v_atLeast({min}, {locale})),
      v.transform((value) => value.toString()),
    ),
    v.pipe(v.string(), v.regex(/^-?\d+(\.\d+)?$/, m.v_NaN({}, {locale}))),
  );
}

export function numberStringMaximum(max: number | string, locale?: Locale) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && value.trim() !== '') {
        return Number(value.trim());
      }
      return value;
    }),
    v.pipe(
      v.number(),
      v.maxValue(max, m.v_atMost({max}, {locale})),
      v.transform((value) => value.toString()),
    ),
    v.pipe(v.string(), v.regex(/^-?\d+(\.\d+)?$/, m.v_NaN({}, {locale}))),
  );
}

export function numberStringRange(
  min: number | string,
  max: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && value.trim() !== '') {
        return Number(value.trim());
      }
      return value;
    }),
    v.pipe(
      v.number(),
      v.minValue(min, m.v_atLeast({min}, {locale})),
      v.maxValue(max, m.v_atMost({max}, {locale})),
      v.transform((value) => value.toString()),
    ),
    v.pipe(v.string(), v.regex(/^-?\d+(\.\d+)?$/, m.v_NaN({}, {locale}))),
  );
}

export function numberStringEmptyNullMinimum(
  min: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') return null;
        return Number(trimmed);
      }
      return value;
    }),
    v.union([
      v.null(),
      v.pipe(
        v.number(),
        v.minValue(min, m.v_atLeast({min}, {locale})),
        v.transform((value) => value.toString()),
        v.pipe(v.string(), v.regex(/^-?\d+(\.\d+)?$/, m.v_NaN({}, {locale}))),
      ),
    ]),
  );
}

export function numberStringEmptyNullMaximum(
  max: number | string,
  locale?: Locale,
) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') return null;
        return Number(trimmed);
      }
      return value;
    }),
    v.union([
      v.null(),
      v.pipe(
        v.number(),
        v.maxValue(max, m.v_atMost({max}, {locale})),
        v.transform((value) => value.toString()),
        v.pipe(v.string(), v.regex(/^-?\d+(\.\d+)?$/, m.v_NaN({}, {locale}))),
      ),
    ]),
  );
}

export function numberStringEmptyNullRange(
  min: number | string,
  max: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') return null;
        return Number(trimmed);
      }
      return value;
    }),
    v.union([
      v.null(),
      v.pipe(
        v.number(),
        v.minValue(min, m.v_atLeast({min}, {locale})),
        v.maxValue(max, m.v_atMost({max}, {locale})),
        v.transform((value) => value.toString()),
        v.pipe(v.string(), v.regex(/^-?\d+(\.\d+)?$/, m.v_NaN({}, {locale}))),
      ),
    ]),
  );
}

export function numberStringFixedMinimum(
  fractionDigits: number,
  min: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.number(), v.string()]),
    // 1. Normalize early (so we can validate consistently)
    v.transform((value) => {
      if (typeof value === 'number') return value;
      const trimmed = value.trim();
      if (trimmed === '') return NaN;
      return Number(trimmed);
    }),
    // 2. Validate it's a valid number
    v.check((value) => Number.isFinite(value), m.v_NaN({}, {locale})),
    // 3. Validate minimum
    v.minValue(min, m.v_atLeast({min}, {locale})),
    // 4. Validate decimal precision
    v.check(
      (value) => {
        const shifted = value * 10 ** fractionDigits;
        return Math.abs(shifted - Math.trunc(shifted)) < Number.EPSILON;
      },
      m.v_overPrecision({fractionDigits}, {locale}),
    ),
    // 5. Format
    v.transform((value) => value.toFixed(fractionDigits)),
    v.string(),
  );
}

export function numberStringFixedMaximum(
  fractionDigits: number,
  max: number | string,
  locale?: Locale,
) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.number(), v.string()]),
    // 1. Normalize early (so we can validate consistently)
    v.transform((value) => {
      if (typeof value === 'number') return value;
      const trimmed = value.trim();
      if (trimmed === '') return NaN;
      return Number(trimmed);
    }),
    // 2. Validate it's a valid number
    v.check((value) => Number.isFinite(value), m.v_NaN({}, {locale})),
    // 3. Validate maximum
    v.maxValue(max, m.v_atMost({max}, {locale})),
    // 4. Validate decimal precision
    v.check(
      (value) => {
        const shifted = value * 10 ** fractionDigits;
        return Math.abs(shifted - Math.trunc(shifted)) < Number.EPSILON;
      },
      m.v_overPrecision({fractionDigits}, {locale}),
    ),
    // 5. Format
    v.transform((value) => value.toFixed(fractionDigits)),
    v.string(),
  );
}

export function numberStringFixedRange(
  fractionDigits: number,
  min: number | string,
  max: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.number(), v.string()]),
    // 1. Normalize early (so we can validate consistently)
    v.transform((value) => {
      if (typeof value === 'number') return value;
      const trimmed = value.trim();
      if (trimmed === '') return NaN;
      return Number(trimmed);
    }),
    // 2. Validate it's a valid number
    v.check((value) => Number.isFinite(value), m.v_NaN({}, {locale})),
    // 3. Validate range
    v.minValue(min, m.v_atLeast({min}, {locale})),
    v.maxValue(max, m.v_atMost({max}, {locale})),
    // 4. Validate decimal precision
    v.check(
      (value) => {
        const shifted = value * 10 ** fractionDigits;
        return Math.abs(shifted - Math.trunc(shifted)) < Number.EPSILON;
      },
      m.v_overPrecision({fractionDigits}, {locale}),
    ),
    // 5. Format
    v.transform((value) => value.toFixed(fractionDigits)),
    v.string(),
  );
}

export function numberStringFixedEmptyNullMinimum(
  fractionDigits: number,
  min: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  return v.pipe(
    v.union([v.number(), v.string()]),
    // 1. Normalize early (so we can validate consistently)
    v.transform((value) => {
      if (typeof value === 'number') return value;
      const trimmed = value.trim();
      if (trimmed === '') return null;
      return Number(trimmed);
    }),
    v.union([
      v.null(),
      v.pipe(
        v.number(),
        v.check((value) => Number.isFinite(value), m.v_NaN({}, {locale})),
        v.minValue(min, m.v_atLeast({min}, {locale})),
        v.check(
          (value) => {
            const shifted = value * 10 ** fractionDigits;
            return Math.abs(shifted - Math.trunc(shifted)) < Number.EPSILON;
          },
          m.v_overPrecision({fractionDigits}, {locale}),
        ),
        v.transform((value) => value.toFixed(fractionDigits)),
        v.string(),
      ),
    ]),
  );
}

export function numberStringFixedEmptyNullMaximum(
  fractionDigits: number,
  max: number | string,
  locale?: Locale,
) {
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.number(), v.string()]),
    // 1. Normalize early (so we can validate consistently)
    v.transform((value) => {
      if (typeof value === 'number') return value;
      const trimmed = value.trim();
      if (trimmed === '') return null;
      return Number(trimmed);
    }),
    v.union([
      v.null(),
      v.pipe(
        v.number(),
        v.check((value) => Number.isFinite(value), m.v_NaN({}, {locale})),
        v.maxValue(max, m.v_atMost({max}, {locale})),
        v.check(
          (value) => {
            const shifted = value * 10 ** fractionDigits;
            return Math.abs(shifted - Math.trunc(shifted)) < Number.EPSILON;
          },
          m.v_overPrecision({fractionDigits}, {locale}),
        ),
        v.transform((value) => value.toFixed(fractionDigits)),
        v.string(),
      ),
    ]),
  );
}

export function numberStringFixedEmptyNullRange(
  fractionDigits: number,
  min: number | string,
  max: number | string,
  locale?: Locale,
) {
  if (typeof min === 'string') min = Number(min);
  if (typeof max === 'string') max = Number(max);
  return v.pipe(
    v.union([v.number(), v.string()]),
    // 1. Normalize early (so we can validate consistently)
    v.transform((value) => {
      if (typeof value === 'number') return value;
      const trimmed = value.trim();
      if (trimmed === '') return null;
      return Number(trimmed);
    }),
    v.union([
      v.null(),
      v.pipe(
        v.number(),
        v.check((value) => Number.isFinite(value), m.v_NaN({}, {locale})),
        v.minValue(min, m.v_atLeast({min}, {locale})),
        v.maxValue(max, m.v_atMost({max}, {locale})),
        v.check(
          (value) => {
            const shifted = value * 10 ** fractionDigits;
            return Math.abs(shifted - Math.trunc(shifted)) < Number.EPSILON;
          },
          m.v_overPrecision({fractionDigits}, {locale}),
        ),
        v.transform((value) => value.toFixed(fractionDigits)),
        v.string(),
      ),
    ]),
  );
}
