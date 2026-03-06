import * as v from 'valibot';
import {parsePhoneNumberFromString, CountryCode} from 'libphonenumber-js';

export {parsePhoneNumberFromString, CountryCode};

/**
 * Checks if a phone number is valid according to E.164 format.
 *
 * @param phoneNumber - The phone number to check.
 */
export function isValidE164(phoneNumber: string): boolean {
  // Basic E.164 format check
  if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
    return false;
  }
  const parsed = parsePhoneNumberFromString(phoneNumber);
  return parsed?.isValid() ?? false;
}

/**
 * Checks if a phone number is valid according to the specified country code.
 *
 * @param phoneNumber - The phone number to check.
 * @param countryCode - The 2-letter country code (ISO 3166-1 alpha-2).
 */
export function isValidPhoneNumber(
  phoneNumber: string,
  countryCode: CountryCode,
) {
  const parsed = parsePhoneNumberFromString(phoneNumber, {
    defaultCountry: countryCode,
  });
  return parsed?.isValid() ?? false;
}

/**
 * Converts a phone number to E.164 format.
 *
 * @param phoneNumber
 * @param defaultCountry
 */
export function toE164(
  phoneNumber: string,
  defaultCountry?: CountryCode,
): string | null {
  const phone = parsePhoneNumberFromString(phoneNumber, defaultCountry);

  if (!phone || !phone.isValid()) {
    return null;
  }

  return phone.number; // already E.164
}

/**
 * Generates a valibot schema to validate a phone number given a country code.
 *
 * @param countryCode - The 2-letter country code (ISO 3166-1 alpha-2).
 * @param msg - The error message to use if the phone number is invalid.
 */
export function phoneNumberSchema(countryCode: CountryCode, msg?: string) {
  return v.pipe(
    v.string(),
    v.check((phoneNumber) => {
      const parsed = parsePhoneNumberFromString(phoneNumber, {
        defaultCountry: countryCode,
      });
      return parsed?.isValid() ?? false;
    }, msg ?? 'Invalid phone number'),
  );
}

/**
 * Generates a valibot schema to validate a phone number in E.164 format.
 *
 * @param msg - The error message to use if the phone number is invalid.
 */
export function phoneNumberE164Schema(msg?: string) {
  return v.pipe(
    v.string(),
    v.check((phoneNumber) => {
      if (!isValidE164(phoneNumber)) return false;
      const parsed = parsePhoneNumberFromString(phoneNumber);
      return parsed?.isValid() ?? false;
    }, msg ?? 'Invalid phone number'),
  );
}

/**
 * Generates a valibot schema to validate a phone number and transform it into E.164 format
 *
 * @param countryCode - The 2-letter country code (ISO 3166-1 alpha-2).
 * @param msg - The error message to use if the phone number is invalid.
 */
export function phoneNumberToE164Schema(
  countryCode?: CountryCode,
  msg?: string,
) {
  return v.pipe(
    v.string(),
    v.trim(),
    v.transform((input) => toE164(input, countryCode)),
    v.check((phoneNumber) => {
      if (!phoneNumber) return false;
      if (!isValidE164(phoneNumber)) return false;
      const parsed = parsePhoneNumberFromString(phoneNumber);
      return parsed?.isValid() ?? false;
    }, msg ?? 'Invalid phone number'),
  );
}
