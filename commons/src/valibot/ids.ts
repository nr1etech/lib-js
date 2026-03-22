import * as v from 'valibot';
import {Locale} from './locale.js';
import {m} from '../paraglide/messages.js';

export function ksuid(locale?: Locale) {
  return v.pipe(
    v.string(m.v_invalidValue({}, {locale})),
    v.length(27, m.v_length({length: 27}, {locale})),
    v.regex(/^[0-9A-Za-z]{27}$/, m.v_invalidValue({}, {locale})),
  );
}

export function uuid(locale?: Locale) {
  return v.pipe(
    v.string(m.v_invalidValue({}, {locale})),
    v.length(36, m.v_length({length: 36}, {locale})),
    v.regex(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      m.v_invalidValue({}, {locale}),
    ),
  );
}
