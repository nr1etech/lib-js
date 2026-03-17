import {BaseUrlFn, Env} from '../client.js';

export const BCL_V2_TEST_BASE_URL =
  'https://balanceplatform-api-test.adyen.com/bcl/v2/';
export const BCL_V2_LIVE_BASE_URL =
  'https://balanceplatform-api-live.adyen.com/bcl/v2/';

export const bclV2BaseUrl: BaseUrlFn = (env: Env) => {
  return env === 'test' ? BCL_V2_TEST_BASE_URL : BCL_V2_LIVE_BASE_URL;
};
