import {expect, test} from 'vitest';
import {ksuid, uuidv4, uuidv4b64, uuidv7, uuidv7b64} from './index.js';

test('Test ID generation', async () => {
  expect(uuidv4()).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
  expect(uuidv7()).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
  expect(uuidv4b64()).toMatch(/^[0-9a-zA-Z_-]{22}$/);
  expect(uuidv7b64()).toMatch(/^[0-9a-zA-Z_-]{22}$/);
  expect(await ksuid()).toMatch(/^[0-9A-Za-z]{27}$/);
});
