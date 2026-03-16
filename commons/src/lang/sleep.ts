/**
 * Sleep for a given amount of time
 *
 * @param ms the number of milliseconds to sleep
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
