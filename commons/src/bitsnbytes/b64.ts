import {IllegalArgumentError} from '../errors/errors.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const BASE64_CHARS: Uint8Array = new Uint8Array([
  0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d,
  0x4e, 0x4f, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a,
  0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d,
  0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a,
  0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2b, 0x2f, 0x3d,
]);
// 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
// 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
// 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
// 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
// '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/', '='

export const URL_MODIFIED_BASE64_CHARS: Uint8Array = new Uint8Array([
  0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d,
  0x4e, 0x4f, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a,
  0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d,
  0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a,
  0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2d, 0x5f,
]);
// 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
// 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
// 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
// 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
// '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_',

export const YUI_BASE64_CHARS: Uint8Array = new Uint8Array([
  0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d,
  0x4e, 0x4f, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a,
  0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d,
  0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a,
  0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2e, 0x5f, 0x2d,
]);
// 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
// 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
// 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
// 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
// '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '_', '-'

export type Base64CharSet = 'b64' | 'url' | 'yui';

export interface Base64Options {
  readonly fromIndex?: number;
  readonly toIndex?: number;
  readonly b64chars?: Uint8Array | Base64CharSet;
}

/**
 * Returns a base64 character set and validates one if passed in.
 *
 * @param b64chars a base64 character set
 */
export function b64Charset(b64chars?: Uint8Array | Base64CharSet): Uint8Array {
  if (b64chars === undefined || b64chars === null) {
    return BASE64_CHARS;
  }
  if (b64chars instanceof Uint8Array) {
    if (b64chars.length !== 65 && b64chars.length !== 64) {
      throw new IllegalArgumentError(
        'b64chars',
        'Base 64 character sets must be 64 or 65 characters.',
      );
    }
    return b64chars;
  }
  switch (b64chars) {
    case 'b64':
      return BASE64_CHARS;
    case 'url':
      return URL_MODIFIED_BASE64_CHARS;
    case 'yui':
      return YUI_BASE64_CHARS;
    default:
      throw new IllegalArgumentError(
        'b64chars',
        `Invalid base64 character set '${b64chars}'`,
      );
  }
}

/**
 * Base64 encodes a series of bytes.
 *
 * @param buf Bytes to encode
 * @param opts Encoding options
 * @return a base64 string
 */
export function tob64(buf: Uint8Array, opts?: Base64Options): Uint8Array {
  const b64chars = b64Charset(opts?.b64chars);
  const toIndex = opts?.toIndex ?? buf.length;
  const fromIndex = opts?.fromIndex ?? 0;
  // every 3 bytes is 4 characters in padded base64 (6 bits per char)
  const num = toIndex - fromIndex;
  const numc =
    b64chars.length === 65
      ? ((num + 2 - ((num + 2) % 3)) / 3) * 4 // padded
      : (num * 8) / 6 + ((num * 8) % 6 !== 0 ? 1 : 0); // not padded
  const b64 = new Uint8Array(numc);
  let n = 0;
  for (let i = 0; i < toIndex; i += 3) {
    const v =
      ((buf[i] & 0xff) << 16) |
      (i + 1 < toIndex ? (buf[i + 1] & 0xff) << 8 : 0) |
      (i + 2 < toIndex ? buf[i + 2] & 0xff : 0);
    b64[n++] = b64chars[(v >>> 18) & 0x3f];
    b64[n++] = b64chars[(v >>> 12) & 0x3f];
    switch (
      toIndex - i // calculate bytes remaining to be processed
    ) {
      case 1: // 0 bytes left to process
        if (b64chars.length === 65) {
          b64[n++] = b64chars[64];
          b64[n++] = b64chars[64];
        }
        break;
      case 2: // 1 byte left to process
        b64[n++] = b64chars[(v >>> 6) & 0x3f];
        if (b64chars.length === 65) {
          b64[n++] = b64chars[64];
        }
        break;
      default:
        b64[n++] = b64chars[(v >>> 6) & 0x3f];
        b64[n++] = b64chars[v & 0x3f];
        break;
    }
  }
  return b64;
}

export function fromb64(buf: Uint8Array, opts?: Base64Options): Uint8Array {
  const b64chars = b64Charset(opts?.b64chars);
  const toIndex = opts?.toIndex ?? buf.length;
  const fromIndex = opts?.fromIndex ?? 0;
  const num = toIndex - fromIndex;
  const numc = (num * 6) / 8;
  const b = new Uint8Array(numc);
  let n = 0;
  for (let i = fromIndex; i < toIndex; i += 4) {
    const v =
      (b64chars.indexOf(buf[i]) << 18) |
      (b64chars.indexOf(buf[i + 1]) << 12) |
      (b64chars.indexOf(buf[i + 2]) << 6) |
      b64chars.indexOf(buf[i + 3]);
    b[n++] = (v >>> 16) & 0xff;
    if (buf[i + 2] !== 61) {
      b[n++] = (v >>> 8) & 0xff;
      if (buf[i + 3] !== 61) {
        b[n++] = v & 0xff;
      }
    }
  }
  return b;
}

/**
 * Base64 encodes a series of bytes to a string.
 *
 * @param buf Bytes to encode
 * @param opts Encoding options
 * @return a base64 string
 */
export function tob64s(buf: Uint8Array, opts?: Base64Options): string {
  return decoder.decode(tob64(buf, opts));
}

export function sfromb64(str: string, opts?: Base64Options): Uint8Array {
  return fromb64(encoder.encode(str), opts);
}

/**
 * Base64 encodes a string to a string.
 *
 * @param str String to encode
 * @param opts Encoding options
 * @return a base64 string
 */
export function stob64s(str: string, opts?: Base64Options): string {
  return tob64s(encoder.encode(str), opts);
}

export function sfromb64s(str: string, opts?: Base64Options): string {
  return decoder.decode(fromb64(encoder.encode(str), opts));
}
