import * as uuid from 'uuid';
import {tob64s} from '../bitsnbytes/index.js';
import KSUID from 'ksuid';

export function uuidv4() {
  return uuid.v4();
}

export function uuidv7() {
  return uuid.v7();
}

export function uuidv4b64() {
  const buf = new Uint8Array(16);
  uuid.v4(undefined, buf);
  return tob64s(buf, {b64chars: 'url'});
}

export function uuidv7b64() {
  const buf = new Uint8Array(16);
  uuid.v7(undefined, buf);
  return tob64s(buf, {b64chars: 'url'});
}

export async function ksuid(): Promise<string> {
  return (await KSUID.random()).string;
}
