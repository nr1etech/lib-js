export async function handleError(response: Response) {
  let error;
  if (response.headers.get('Content-Type')?.includes('application/json')) {
    error = await response.json();
  } else {
    error = await response.text();
  }
  console.log('Error', error);
  // TODO Handle this better
  throw new Error(error);
}
