import {HttpStatusCode} from '../http/index.js';
import {isError, isObject} from '../lang/index.js';

/**
 * An extended version of Error that includes an HttpStatusCode.
 * This can be useful in middleware error handlers to determine http status codes to return to the client.
 */
export interface HttpError extends Error {
  /**
   * The HTTP status code.
   */
  statusCode: HttpStatusCode | number;
}

/**
 * Checks if the given parameter is an HttpError.
 *
 * @param e The parameter to check
 */
export function isHttpError(e?: unknown): e is HttpError {
  return isObject(e) && !!(e && e.stack && e.statusCode && e.message && e.name);
}

/**
 * Thrown when a resource cannot be found.
 */
export class NotFoundError extends Error implements HttpError {
  readonly statusCode = HttpStatusCode.NOT_FOUND;
  /**
   * The max-age value to set in the Cache-Control header if used in a middleware.
   */
  readonly maxAge?: number;
  constructor(message?: string, maxAge?: number) {
    message = message ?? 'Not found';
    super(message);
    this.name = 'NotFoundError';
    this.maxAge = maxAge;
  }
}

/**
 * Checks if the given parameter is a NotFoundError.
 *
 * @param e The parameter to check
 */
export function isNotFoundError(e?: unknown): e is NotFoundError {
  return isHttpError(e) && e.name === 'NotFoundError';
}

/**
 * Thrown when a request is missing authentication credentials.
 */
export class UnauthorizedError extends Error implements HttpError {
  readonly statusCode = HttpStatusCode.UNAUTHORIZED;
  constructor(message?: string) {
    message = message ?? 'Unauthorized';
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Checks if the given parameter is a UnauthorizedError.
 *
 * @param e The parameter to check
 */
export function isUnauthorizedError(e?: unknown): e is UnauthorizedError {
  return isHttpError(e) && e.name === 'UnauthorizedError';
}

/**
 * Thrown when credentials are present, but the requested operations is not allowed.
 */
export class ForbiddenError extends Error implements HttpError {
  readonly statusCode = HttpStatusCode.FORBIDDEN;
  constructor(message?: string) {
    message = message ?? 'Forbidden';
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Checks if the given parameter is a ForbiddenError.
 *
 * @param e The parameter to check
 */
export function isForbiddenError(e?: unknown): e is ForbiddenError {
  return isHttpError(e) && e.name === 'ForbiddenError';
}

/**
 * Thrown when a validation error occurs.
 */
export class ValidationError extends Error implements HttpError {
  readonly statusCode = HttpStatusCode.BAD_REQUEST;
  constructor(message?: string) {
    message = message ?? 'Validation error';
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Checks if the given variable is a ValidationError.
 *
 * @param e The variable to check
 */
export function isValidationError(e?: unknown): e is ValidationError {
  return isHttpError(e) && e.name === 'ValidationError';
}

/**
 * Thrown when a bad request is made.
 */
export class BadRequestError extends Error implements HttpError {
  readonly statusCode = HttpStatusCode.BAD_REQUEST;
  constructor(message?: string) {
    message = message ?? 'Bad request';
    super(message ?? 'Bad request');
    this.name = 'BadRequestError';
  }
}

/**
 * Checks if the given parameter is a BadRequestError.
 *
 * @param e The parameter to check
 */
export function isBadRequestError(e?: unknown): e is BadRequestError {
  return isHttpError(e) && e.name === 'BadRequestError';
}

/**
 * Throws when an internal server error occurs.
 */
export class InternalServerError extends Error implements HttpError {
  readonly statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  constructor(message?: string) {
    message = message ?? 'Internal server error';
    super(message);
    this.name = 'InternalServerError';
  }
}

/**
 * Checks if the given parameter is a InternalServerError.
 *
 * @param e The parameter to check
 */
export function isInternalServerError(e?: unknown): e is InternalServerError {
  return isHttpError(e) && e.name === 'InternalServerError';
}

/**
 * Thrown when a conflict occurs.
 */
export class ConflictError extends Error implements HttpError {
  readonly statusCode = HttpStatusCode.CONFLICT;
  constructor(message?: string) {
    message = message ?? 'Conflict';
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * Checks if the given parameter is a ConflictError.
 *
 * @param e The parameter to check
 */
export function isConflictError(e?: unknown): e is ConflictError {
  return isHttpError(e) && e.name === 'ConflictError';
}

/**
 * Thrown when a unsupported media type is used.
 */
export class UnsupportedMediaTypeError extends Error implements HttpError {
  readonly statusCode = HttpStatusCode.UNSUPPORTED_MEDIA_TYPE;
  constructor(message?: string) {
    message = message ?? 'Unsupported media type';
    super(message);
    this.name = 'UnsupportedMediaTypeError';
  }
}

/**
 * Checks if the given parameter is a UnsupportedMediaTypeError.
 *
 * @param e The parameter to check
 */
export function isUnsupportedMediaTypeError(
  e?: unknown,
): e is UnsupportedMediaTypeError {
  return isHttpError(e) && e.name === 'UnsupportedMediaTypeError';
}

/**
 * Thrown when a requested operation is not implemented.
 */
export class NotImplementedError extends Error implements HttpError {
  readonly statusCode = HttpStatusCode.NOT_IMPLEMENTED;
  readonly expose = true;
  constructor(message?: string) {
    message = message ?? 'Not implemented';
    super(message);
    this.name = 'NotImplementedError';
  }
}

/**
 * Checks if the given parameter is a NotImplementedError.
 *
 * @param e The parameter to check
 */
export function isNotImplementedError(e?: unknown): e is NotImplementedError {
  return isHttpError(e) && e.name === 'NotImplementedError';
}

/**
 * Thrown when an illegal argument is passed to a function.
 */
export class IllegalArgumentError extends Error {
  readonly argName: string;
  constructor(argName: string, message?: string) {
    message = message ?? `Illegal argument ${argName}`;
    super(message);
    this.argName = argName;
    this.name = 'IllegalArgumentError';
  }
}

/**
 * Checks if the given parameter is a IllegalArgumentError.
 *
 * @param e The parameter to check
 */
export function isIllegalArgumentError(e?: unknown): e is IllegalArgumentError {
  return isError(e) && e.name === 'IllegalArgumentError';
}

/**
 * Converts the given parameter to an HttpError.
 *
 * @param code The HTTP status code
 * @param message The error message
 */
export function toError(
  code: number | HttpStatusCode,
  message?: string,
): Error {
  switch (code) {
    case HttpStatusCode.NOT_FOUND:
      return new NotFoundError(message);
    case HttpStatusCode.FORBIDDEN:
      return new ForbiddenError(message);
    case HttpStatusCode.BAD_REQUEST:
      return new BadRequestError(message);
    case HttpStatusCode.INTERNAL_SERVER_ERROR:
      return new InternalServerError(message);
    case HttpStatusCode.CONFLICT:
      return new ConflictError(message);
    case HttpStatusCode.UNSUPPORTED_MEDIA_TYPE:
      return new UnsupportedMediaTypeError(message);
    case HttpStatusCode.NOT_IMPLEMENTED:
      return new NotImplementedError(message);
    default:
      return new Error(message);
  }
}
