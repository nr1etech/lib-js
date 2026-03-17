import {BaseUrlFn, Env} from '../client.js';

export const LEM_V4_TEST_BASE_URL = 'https://kyc-test.adyen.com/lem/v4/';
export const LEM_V4_LIVE_BASE_URL = 'https://kyc-live.adyen.com/lem/v4/';

export const lemV4BaseUrl: BaseUrlFn = (env: Env) => {
  return env === 'test' ? LEM_V4_TEST_BASE_URL : LEM_V4_LIVE_BASE_URL;
};
