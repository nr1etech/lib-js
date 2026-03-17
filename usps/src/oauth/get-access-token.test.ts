import { test, expect } from "vitest";
import { getAccessToken } from "./get-access-token.js";

test("Test getAccessToken @int", async () => {
  const consumerKey = process.env.USPS_CONSUMER_KEY;
  const consumerSecret = process.env.USPS_CONSUMER_SECRET;
  const baseUrl = process.env.USPS_BASE_URL;

  if (!consumerKey) {
    throw new Error("Missing USPS_CONSUMER_KEY");
  }
  if (!consumerSecret) {
    throw new Error("Missing USPS_CONSUMER_SECRET");
  }

  const result = await getAccessToken({
    consumerKey,
    consumerSecret,
    baseUrl,
  });

  expect(result).toBeDefined();
  expect(result.access_token).toBeDefined();
  expect(result.token_type).toBeDefined();
  expect(result.expires_in).toBeDefined();
  console.log("Access Token:", result.access_token);
  console.log("Token Type:", result.token_type);
  console.log("Expires In:", result.expires_in);
});
