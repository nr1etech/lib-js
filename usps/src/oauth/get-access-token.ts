import { handleError } from "../errors.js";

export type GetAccessTokenInput = {
  consumerKey: string;
  consumerSecret: string;
  baseUrl?: string;
};

export type GetAccessTokenOutput = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
};

export async function getAccessToken(
  input: GetAccessTokenInput,
): Promise<GetAccessTokenOutput> {
  if (!input.consumerKey) {
    throw new Error("consumerKey is required");
  }
  if (!input.consumerSecret) {
    throw new Error("consumerSecret is required");
  }
  const oauthBaseUrl = input.baseUrl ?? "https://apis.usps.com";
  const response = await fetch(`${oauthBaseUrl}/oauth2/v3/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: input.consumerKey,
      client_secret: input.consumerSecret,
      scope: "addresses",
    }),
  });
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("text/html")) {
      await response.text();
      throw new Error(
        `OAuth token request failed with status ${response.status}. The endpoint may be incorrect or the service may be unavailable.`,
      );
    }
    await handleError(response);
  }
  const result = (await response.json()) as GetAccessTokenOutput;

  if (!result.access_token || result.access_token === "") {
    throw new Error("The access_token field is missing or invalid");
  }

  return result;
}
