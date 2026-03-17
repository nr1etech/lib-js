import { test, expect } from "vitest";
import { createUSPSClient, USPSClient } from "./client.js";
import { getAccessToken } from "./oauth/get-access-token.js";

export type GetClientInput = {
  consumerKey: string;
  consumerSecret: string;
  baseUrl?: string;
};

export async function getClient(input: GetClientInput): Promise<USPSClient> {
  if (!input.consumerKey) {
    throw new Error("consumerKey is required");
  }
  if (!input.consumerSecret) {
    throw new Error("consumerSecret is required");
  }

  const tokenResponse = await getAccessToken({
    consumerKey: input.consumerKey,
    consumerSecret: input.consumerSecret,
    baseUrl: input.baseUrl,
  });

  return createUSPSClient({
    accessToken: tokenResponse.access_token,
    baseUrl: input.baseUrl,
  });
}

test("Empty test", () => {
  expect(true).toBe(true);
});
