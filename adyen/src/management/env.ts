import type {Env} from '../client.js';

export function managementV3BaseUrl(env: Env): string {
  if (env === 'test') {
    return 'https://management-test.adyen.com/v3/';
  }
  return 'https://management-live.adyen.com/v3/';
}
