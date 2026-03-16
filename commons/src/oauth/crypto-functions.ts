import * as crypto from 'crypto';
import {tob64s} from '../bitsnbytes/index.js';

/**
 * Generates a state string for use with OAuth2.0 authorization requests.
 *
 * @param len The length of the state string in bytes. Defaults to 16 bytes.
 */
export function generateState(len?: number): string {
  if (len && len < 16) {
    throw new Error('State must be at least 16 bytes');
  }
  return tob64s(crypto.randomBytes(len ?? 16), {
    b64chars: 'url',
  });
}

/**
 * Generates a nonce string for use with OAuth2.0 authorization requests.
 *
 * @param len The length of the state string in bytes. Defaults to 16 bytes.
 */
export function generateNonce(len?: number): string {
  if (len && len < 16) {
    throw new Error('Nonce must be at least 16 bytes');
  }
  return tob64s(crypto.randomBytes(len ?? 16), {
    b64chars: 'url',
  });
}

/**
 * Generates a secret string for use with OAuth2.0 authorization requests.
 *
 * @param len The length of the state string in bytes. Defaults to 32 bytes.
 */
export function generateSecret(len?: number): string {
  if (len && len < 32) {
    throw new Error('Secret must be at least 32 bytes');
  }
  return tob64s(crypto.randomBytes(len ?? 32), {
    b64chars: 'url',
  });
}
