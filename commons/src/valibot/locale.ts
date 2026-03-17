import * as p from '../paraglide/runtime.js';

export type Locale =
  | 'af'
  | 'ar'
  | 'en'
  | 'en-GB'
  | 'en-US'
  | 'en-ZA'
  | 'es'
  | 'es-US'
  | 'fr'
  | 'fr-CA'
  | 'fr-FR';

export function getLocale() {
  return p.getLocale() as Locale;
}

export function setLocale(locale: Locale) {
  p.setLocale(locale);
}
