export type SafeResult<T> =
  | {success: true; output: T}
  | {success: false; error: string};

/**
 * Wraps a throwing function and returns a non-throwing result.
 *
 * @param fn - Function that may throw
 * @param defaultMessage - Message to use if a non-Error is thrown
 */
export function safeCall<T>(
  fn: () => T,
  defaultMessage = 'Unknown error',
): SafeResult<T> {
  try {
    return {success: true, output: fn()};
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : defaultMessage,
    };
  }
}
