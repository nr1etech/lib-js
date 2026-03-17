import { handleError } from "./errors.js";

export type USPSClientConfig = {
  readonly accessToken: string;
  readonly baseUrl?: string;
};

export type GetInput = {
  readonly path: string;
  readonly params?: Record<string, string>;
};

export type PostInput = {
  readonly path: string;
  readonly body: object;
};

export interface USPSClient {
  readonly baseUrl: string;
  readonly get: <T>(input: GetInput) => Promise<T>;
  readonly post: <T>(input: PostInput) => Promise<T>;
}

export function createUSPSClient(config: USPSClientConfig): USPSClient {
  if (!config.accessToken) {
    throw new Error("accessToken is required");
  }
  const baseUrl = config.baseUrl ?? "https://apis.usps.com";
  const accessToken = config.accessToken;

  const get = async <T,>(input: GetInput): Promise<T> => {
    const url = new URL(input.path, baseUrl);
    if (input.params) {
      for (const [key, value] of Object.entries(input.params)) {
        url.searchParams.append(key, value);
      }
    }
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });
    if (!response.ok) {
      await handleError(response);
    }
    return (await response.json()) as T;
  };

  const post = async <T,>(input: PostInput): Promise<T> => {
    const url = new URL(input.path, baseUrl);
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(input.body),
    });
    if (!response.ok) {
      await handleError(response);
    }
    return (await response.json()) as T;
  };

  return {
    baseUrl,
    get,
    post,
  };
}
