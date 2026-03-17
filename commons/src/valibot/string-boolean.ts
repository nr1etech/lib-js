import {Locale, v} from './index.js';
import {m} from '../paraglide/messages.js';

/**
 * Accepts a boolean or a string as true, false, yes, or no in any case, trims
 * whitespace, and converts strings to a boolean.
 *
 * @param locale - The optional locale to use for error messages.
 */
export function stringBoolean(locale?: Locale) {
  return v.pipe(
    v.union([v.boolean(), v.string()]),
    v.transform((value) => {
      if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true') return true;
        if (normalized === 'false') return false;
        if (normalized === 'yes') return true;
        if (normalized === 'no') return false;
      }
      return value;
    }),
    v.boolean(m.v_invalidValue({}, {locale})),
  );
}
