import {test, expect} from 'vitest';
import {maskCardNumber} from './card.js';

test('Test maskCardNumber', () => {
  let masked = maskCardNumber('4111111111111111');
  expect(masked).toEqual('411111******1111');
  masked = maskCardNumber('4111 1111 1111 1111');
  expect(masked).toEqual('411111******1111');
  masked = maskCardNumber('3782 822463 10005');
  expect(masked).toEqual('378282*****0005');
  masked = maskCardNumber('1234567');
  expect(masked).toEqual('*******');
  masked = maskCardNumber('12345678');
  expect(masked).toEqual('****5678');
  masked = maskCardNumber('1234567890');
  expect(masked).toEqual('******7890');
  masked = maskCardNumber('');
  expect(masked).toBeNull();
  masked = maskCardNumber(null);
  expect(masked).toBeNull();
  masked = maskCardNumber(undefined);
  expect(masked).toBeNull();
});
