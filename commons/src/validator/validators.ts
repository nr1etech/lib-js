import {ValidationError} from '../errors/index.js';

/**
 * Tests if a value is null or undefined.
 *
 * @param o the value to check
 */
export function isNotNull(o?: unknown): o is NonNullable<unknown> {
  return o !== undefined && o !== null;
}

/**
 * Throws a ValidationError if the value is null or undefined.
 * This function also asserts the value to be NonNullable if the check passes.
 *
 * @param name the name of the variable
 * @param o the value to check
 */
export function notNull(
  name: string,
  o?: unknown,
): asserts o is NonNullable<unknown> {
  if (!isNotNull(o)) {
    throw new ValidationError(`${name} may not be null or undefined`);
  }
}

/**
 * Tests if a value is empty, null, undefined or has a length of 0.
 *
 * @param o the value to check
 */
export function isNotEmpty(o?: unknown): o is NonNullable<unknown> {
  return !(o === undefined || o === null || o.toString().length === 0);
}

/**
 * Throws a ValidationError if the value is null, undefined or the length is 0.
 * This function also asserts the value to be NonNullable if the check passes.
 *
 * @param name the name of the variable
 * @param o the value to check
 */
export function notEmpty(
  name: string,
  o?: unknown,
): asserts o is NonNullable<unknown> {
  if (!isNotEmpty(o)) {
    throw new ValidationError(`${name} may not be empty`);
  }
}

/**
 * Tests if a value is null, undefined, has a length of 0 or contains only whitespace.
 *
 * @param o the value to check
 */
export function isNotBlank(o?: unknown): o is NonNullable<unknown> {
  return !(o === undefined || o === null || o.toString().trim().length === 0);
}

/**
 * Throws a ValidationError if the value is null, undefined, has a length of 0 or contains only whitespace.
 * This function also asserts the value to be NonNullable if the check passes.
 *
 * @param name the name of the variable
 * @param o the value to check
 */
export function notBlank(
  name: string,
  o?: unknown,
): asserts o is NonNullable<unknown> {
  if (!isNotBlank(o)) {
    throw new ValidationError(`${name} may not be blank`);
  }
}

/**
 * Tests if a value does not match the regular expression provided.
 * Undefined and null values are skipped and not tested.
 *
 * @param regex the regular expression to test with
 * @param o the value to check
 */
export function isMatch(regex: RegExp, o?: string | null): o is string {
  if (o === undefined || o === null) {
    return true;
  }
  return o.match(regex) !== null;
}

/**
 * Throws a ValidationError if the value matches the regular expression provided.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param regex the regular expression to validate with
 * @param o the value to check
 */
export function match(name: string, regex: RegExp, o?: string | null) {
  if (!isMatch(regex, o)) {
    throw new ValidationError(`${name} must match ${regex}`);
  }
}

/**
 * Tests if a value is a valid email address.
 * Undefined and null values are skipped and not validated.
 *
 * @param o the value to check
 */
export function isEmail(o?: string | null): o is string {
  const expression =
    /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
  return !(o !== undefined && o !== null && !expression.test(o));
}

/**
 * Throws a ValidationError if the value provided is not an email.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param o the value to check
 */
export function email(name: string, o?: string | null) {
  if (!isEmail(o)) {
    throw new ValidationError(`${name} is not a valid email address`);
  }
}

/**
 * Tests if a value has a length that is less than the provided length.
 * Undefined and null values are skipped and not validated.
 *
 * @param length the maximum length of the variable
 * @param o the value to check
 */
export function isMaxLength(length: number, o?: string | unknown[] | null) {
  return !(o !== undefined && o !== null && o.length > length);
}

/**
 * Throws a ValidationError if the value provided has a length that exceeds the provided length.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param length the maximum length of the variable
 * @param o the value to check
 */
export function maxLength(
  name: string,
  length: number,
  o?: string | unknown[] | null,
) {
  if (!isMaxLength(length, o)) {
    throw new ValidationError(`length of ${name} may not exceed ${length}`);
  }
}

/**
 * Tests if a value has a length that is greater than the provided length.
 * Undefined and null values are skipped and not validated.
 *
 * @param length the minimum length of the variable
 * @param o the value to check
 */
export function isMinLength(length: number, o?: string | unknown[] | null) {
  return !(o !== undefined && o !== null && o.length < length);
}

/**
 * Throws a ValidationError if the value provided has a length that is less than the provided length.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param length the minimum length of the variable
 * @param o the value to check
 */
export function minLength(
  name: string,
  length: number,
  o?: string | unknown[] | null,
) {
  if (!isMinLength(length, o)) {
    throw new ValidationError(
      `length of ${name} may not be less than ${length}`,
    );
  }
}

/**
 * Tests if a value provided is a number.
 * Undefined and null values are skipped and not validated.
 *
 * @param o the value to check
 */
export function isNumber(o?: string | null | number): boolean {
  return o === undefined || o === null || !isNaN(+o);
}

/**
 * Throws a ValidationError if the value provided is not a number.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param o the value to check
 */
export function number(name: string, o?: string | null | number) {
  if (!isNumber(o)) {
    throw new ValidationError(`${name} is not a number`);
  }
}

/**
 * Tests if a value is less than the provided minimum value.
 * Undefined and null values are skipped and not validated.
 *
 * @param minValue the minimum value allowed
 * @param o the value to check
 */
export function isMinValue(minValue: number, o?: string | number | null) {
  return o === undefined || o === null || +o >= minValue;
}

/**
 * Throws a ValidationError if the value is less than the provided minimum value.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param minValue the minimum value allowed
 * @param o the value to check
 */
export function minValue(
  name: string,
  minValue: number,
  o?: number | string | null,
) {
  if (!isMinValue(minValue, o)) {
    throw new ValidationError(`${name} may not be less than ${minValue}`);
  }
}

/**
 * Tests if a value is more than the provided maximum value.
 * Undefined and null values are skipped and not validated.
 *
 * @param maxValue the maximum value allowed
 * @param o the value to check
 */
export function isMaxValue(
  maxValue: number,
  o?: string | number | null,
): boolean {
  return !(o !== undefined && o !== null && +o > maxValue);
}

/**
 * Throws a ValidationError if the value is more than the provided maximum value.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param maxValue the maximum value allowed
 * @param o the value to check
 */
export function maxValue(
  name: string,
  maxValue: number,
  o?: number | string | null,
) {
  if (!isMaxValue(maxValue, o)) {
    throw new ValidationError(`${name} may not be greater than ${maxValue}`);
  }
}

/**
 * Tests if the value is between the provided minimum and maximum values inclusive.
 * Undefined and null values are skipped and not validated.
 *
 * @param minValue the minimum value allowed
 * @param maxValue the maximum value allowed
 * @param o the value to check
 */
export function isBetweenValues(
  minValue: number,
  maxValue: number,
  o?: string | number | null,
): boolean {
  return !(o !== undefined && o !== null && (+o < minValue || +o > maxValue));
}

/**
 * Throws a ValidationError if the value is not between the provided minimum and maximum values inclusive.
 * Undefined and null values are skipped and not validated.
 *
 * @param name the name of the variable
 * @param minValue the minimum value allowed
 * @param maxValue the maximum value allowed
 * @param o the value to check
 */
export function betweenValues(
  name: string,
  minValue: number,
  maxValue: number,
  o?: string | number | null,
) {
  if (!isBetweenValues(minValue, maxValue, o)) {
    throw new ValidationError(
      `${name} must be between ${minValue} and ${maxValue}`,
    );
  }
}

const isString = (value: unknown): value is string => typeof value === 'string';

export interface StringValidationOptions {
  readonly required: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly regex?: RegExp;
  readonly notBlank?: boolean;
  readonly notEmpty?: boolean;
  readonly email?: boolean;
  readonly number?: boolean;
}

export function isValidString(
  options: StringValidationOptions,
  value?: unknown,
): value is string {
  if (options.required) {
    if (!isNotNull(value)) {
      return false;
    }
  } else if (value === undefined || value === null) {
    return true;
  }
  if (!isString(value)) {
    return false;
  }
  if (options.minLength && !isMinLength(options.minLength, value)) {
    return false;
  }
  if (options.maxLength && !isMaxLength(options.maxLength, value)) {
    return false;
  }
  if (options.regex && !isMatch(options.regex, value)) {
    return false;
  }
  if (options.notBlank && !isNotBlank(value)) {
    return false;
  }
  if (options.notEmpty && !isNotEmpty(value)) {
    return false;
  }
  if (options.email && !isEmail(value)) {
    return false;
  }
  if (options.number && !isNumber(value)) {
    return false;
  }
  return true;
}

export function validString(
  name: string,
  options: StringValidationOptions,
  value?: unknown,
): void {
  if (options.required) {
    notNull(name, value);
  } else if (value === undefined || value === null) {
    return;
  }
  if (!isString(value)) {
    throw new ValidationError(`${name} must be a string`);
  }
  if (options.minLength) minLength(name, options.minLength, value);
  if (options.maxLength) maxLength(name, options.maxLength, value);
  if (options.regex) match(name, options.regex, value);
  if (options.notBlank) notBlank(name, value);
  if (options.notEmpty) notEmpty(name, value);
  if (options.email) email(name, value);
  if (options.number) number(name, value);
}
