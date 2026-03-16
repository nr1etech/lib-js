import {SESClient} from '@aws-sdk/client-ses';

let sesClient: SESClient | undefined = undefined;

export function getSESClient(region?: string) {
  if (!sesClient) {
    sesClient = new SESClient({region});
  }
  return sesClient;
}
