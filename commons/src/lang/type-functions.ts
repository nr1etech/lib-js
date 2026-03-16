export function isObject(item: unknown): item is Record<string, unknown> {
  return (
    item !== null && typeof item === 'object' && Array.isArray(item) === false
  );
}

export function isString(item: unknown): item is string {
  return typeof item === 'string';
}

export function isError(item: unknown): item is Error {
  return item instanceof Error;
}
