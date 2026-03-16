import {test, expect} from 'vitest';
import {generateId} from './crypto-generator.js';

test('generateId', () => {
  const id = generateId();
  console.log(id);
  expect(id.length).toBe(22);
});
