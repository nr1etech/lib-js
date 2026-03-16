import {isObject} from './type-functions.js';

export function deepEquals(object1: unknown, object2: unknown) {
  if (
    object1 === undefined ||
    object2 === undefined ||
    object1 === null ||
    object2 === null
  ) {
    return false;
  }
  const obj1 = object1 as {[key: string]: unknown};
  const obj2 = object2 as {[key: string]: unknown};
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEquals(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }
  return true;
}
