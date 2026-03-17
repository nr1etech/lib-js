import { test, expect } from "vitest";
import { getZIPCode } from "./get-zipcode.js";
import { getClient } from "../helper.test.js";

test("Test getZIPCode @int", async () => {
  const consumerKey = process.env.USPS_CONSUMER_KEY;
  const consumerSecret = process.env.USPS_CONSUMER_SECRET;

  if (!consumerKey) {
    throw new Error("Missing USPS_CONSUMER_KEY");
  }
  if (!consumerSecret) {
    throw new Error("Missing USPS_CONSUMER_SECRET");
  }

  const client = await getClient({
    consumerKey,
    consumerSecret,
  });

  const result = await getZIPCode(client, {
    streetAddress: "1600 Pennsylvania Avenue NW",
    city: "Washington",
    state: "DC",
  });

  expect(result).toBeDefined();
  expect(result.address).toBeDefined();
  expect(result.address.ZIPCode).toBeDefined();
  console.log(result);
});
