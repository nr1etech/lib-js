import {test} from 'vitest';
import {getCodeSizeBytes} from './lambda.js';

test('Test getCodeSizeBytes @none', async () => {
  const bytes = await getCodeSizeBytes(
    'Platform-DevOhio-Core-GraphA02F0199-Phk5ToXVOcmc',
  );
  console.log(bytes);
});
