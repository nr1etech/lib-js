import {handleError} from './errors.js';

export type Env = 'test' | 'live';
export type BaseUrlFn = (env: Env) => string;

export type AdyenClientConfig = {
  readonly apiKey: string;
  readonly env: Env;
};

export type GetInput = {
  readonly baseUrl: BaseUrlFn;
  readonly path: string;
};

export type PostInput = {
  readonly baseUrl: BaseUrlFn;
  readonly path: string;
  readonly body: object;
  readonly idempotencyKey?: string;
};

export type PatchInput = {
  readonly baseUrl: BaseUrlFn;
  readonly path: string;
  readonly body: object;
};

export type DeleteInput = {
  readonly baseUrl: BaseUrlFn;
  readonly path: string;
};

export interface AdyenClient {
  readonly apiKey: string;
  readonly env: Env;
  readonly get: <T>(input: GetInput) => Promise<T>;
  readonly post: <T>(input: PostInput) => Promise<T>;
  readonly patch: <T>(input: PatchInput) => Promise<T>;
  readonly delete: (input: DeleteInput) => Promise<void>;
}

export function createAdyenClient(config: AdyenClientConfig): AdyenClient {
  if (!config.apiKey) {
    throw new Error('apiKey is required');
  }
  if (!config.env) {
    throw new Error('env is required');
  }

  const apiKey = config.apiKey;
  const env = config.env;

  const get = async <T,>(input: GetInput): Promise<T> => {
    const response = await fetch(new URL(input.path, input.baseUrl(env)), {
      headers: {
        'Accept': 'application/json',
        'x-api-key': apiKey,
      },
      method: 'GET',
    });
    if (!response.ok) {
      await handleError(response);
    }
    return (await response.json()) as T;
  };

  const post = async <T,>(input: PostInput): Promise<T> => {
    const response = await fetch(new URL(input.path, input.baseUrl(env)), {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        ...(input.idempotencyKey
          ? {'Idempotency-Key': input.idempotencyKey}
          : {}),
      },
      method: 'POST',
      body: JSON.stringify(input.body),
    });
    if (!response.ok) {
      await handleError(response);
    }
    return (await response.json()) as T;
  };

  const patch = async <T,>(input: PatchInput): Promise<T> => {
    const response = await fetch(new URL(input.path, input.baseUrl(env)), {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      method: 'PATCH',
      body: JSON.stringify(input.body),
    });
    if (!response.ok) {
      await handleError(response);
    }
    return (await response.json()) as T;
  };

  const deleteMethod = async (input: DeleteInput): Promise<void> => {
    const response = await fetch(new URL(input.path, input.baseUrl(env)), {
      headers: {
        'x-api-key': apiKey,
      },
      method: 'DELETE',
    });
    if (!response.ok) {
      await handleError(response);
    }
    // DELETE returns 204 No Content, so no body to parse
  };

  return {
    apiKey,
    env,
    get,
    post,
    patch,
    delete: deleteMethod,
  };
}
