import {test, expect} from 'vitest';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  isBadRequestError,
  isForbiddenError,
  isInternalServerError,
  isNotFoundError,
  isValidationError,
  NotFoundError,
  toError,
  ValidationError,
} from './errors.js';
import {HttpStatusCode} from '../http/index.js';

test('Test isNotFoundError', () => {
  expect(isNotFoundError(undefined)).toBeFalsy();
  expect(isNotFoundError(null)).toBeFalsy();
  expect(isNotFoundError({})).toBeFalsy();
  expect(isNotFoundError(new ForbiddenError('just a test'))).toBeFalsy();
  expect(isNotFoundError(new NotFoundError('just a test'))).toBeTruthy();
});

test('Test isForbiddenError', () => {
  expect(isForbiddenError(undefined)).toBeFalsy();
  expect(isForbiddenError(null)).toBeFalsy();
  expect(isForbiddenError({})).toBeFalsy();
  expect(isForbiddenError(new NotFoundError('just a test'))).toBeFalsy();
  expect(isForbiddenError(new ForbiddenError('just a test'))).toBeTruthy();
});

test('Test isValidationError', () => {
  expect(isValidationError(undefined)).toBeFalsy();
  expect(isValidationError(null)).toBeFalsy();
  expect(isValidationError({})).toBeFalsy();
  expect(isValidationError(new NotFoundError('just a test'))).toBeFalsy();
  expect(isValidationError(new ValidationError('just a test'))).toBeTruthy();
});

test('Test isBadRequestError', () => {
  expect(isBadRequestError(undefined)).toBeFalsy();
  expect(isBadRequestError(null)).toBeFalsy();
  expect(isBadRequestError({})).toBeFalsy();
  expect(isBadRequestError(new NotFoundError('just a test'))).toBeFalsy();
  expect(isBadRequestError(new BadRequestError('just a test'))).toBeTruthy();
});

test('Test isInternalServerError', () => {
  expect(isInternalServerError(undefined)).toBeFalsy();
  expect(isInternalServerError(null)).toBeFalsy();
  expect(isInternalServerError({})).toBeFalsy();
  expect(isInternalServerError(new NotFoundError('just a test'))).toBeFalsy();
  expect(
    isInternalServerError(new InternalServerError('just a test')),
  ).toBeTruthy();
});

test('Test toError', () => {
  expect(
    isNotFoundError(toError(HttpStatusCode.NOT_FOUND, 'some message')),
  ).toBeTruthy();
  expect(
    isForbiddenError(toError(HttpStatusCode.FORBIDDEN, 'some message')),
  ).toBeTruthy();
  expect(
    isBadRequestError(toError(HttpStatusCode.BAD_REQUEST, 'some message')),
  ).toBeTruthy();
  expect(
    isInternalServerError(
      toError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'some message'),
    ),
  ).toBeTruthy();
});
