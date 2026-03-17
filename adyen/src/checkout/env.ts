import type {Env} from '../client.js';

export function checkoutV71BaseUrl(env: Env): string {
  if (env === 'test') {
    return 'https://checkout-test.adyen.com/v71/';
  }
  return 'https://checkout-live.adyen.com/v71/';
}
