import {locales, getLocale, setLocale} from '../paraglide/runtime.js';

export type Locale = (typeof locales)[number];
export {locales, getLocale, setLocale};
