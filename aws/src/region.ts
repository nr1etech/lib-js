import {getEnv} from '@nr1e/commons/os';

let awsRegion: string | undefined = undefined;

export function getAwsRegion(): string {
  if (awsRegion === undefined) {
    awsRegion = getEnv('AWS_REGION');
  }
  return awsRegion;
}
