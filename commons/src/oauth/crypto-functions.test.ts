import {test, expect} from 'vitest';
import {
  generateNonce,
  generateSecret,
  generateState,
} from './crypto-functions.js';

test('Test generateState', () => {
  const state = generateState();
  expect(state).toMatch(/^[A-Za-z0-9_-]{22}$/);
});

test('Test generateState with custom length', () => {
  const state = generateState(32);
  expect(state).toMatch(/^[A-Za-z0-9_-]{43}$/);
});

test('Test generateState with invalid length', () => {
  expect(() => generateState(10)).toThrow('State must be at least 16 bytes');
});

test('Test generateNonce', () => {
  const nonce = generateNonce();
  expect(nonce).toMatch(/^[A-Za-z0-9_-]{22}$/);
});

test('Test generateNonce with custom length', () => {
  const nonce = generateNonce(32);
  expect(nonce).toMatch(/^[A-Za-z0-9_-]{43}$/);
});

test('Test generateNonce with invalid length', () => {
  expect(() => generateNonce(10)).toThrow('Nonce must be at least 16 bytes');
});

test('Test generateSecret', () => {
  const secret = generateSecret();
  expect(secret).toMatch(/^[A-Za-z0-9_-]{43}$/);
});

test('Test generateSecret with custom length', () => {
  const secret = generateSecret(64);
  expect(secret).toMatch(/^[A-Za-z0-9_-]{86}$/);
});

test('Test generateSecret with invalid length', () => {
  expect(() => generateSecret(10)).toThrow('Secret must be at least 32 bytes');
});
