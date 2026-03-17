import { test, expect } from "vitest";
import { validateAddress } from "./validate-address.js";
import { getClient } from "../helper.test.js";

test("Test validateAddress @int", async () => {
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

  const result = await validateAddress(client, {
    streetAddress: "1600 Pennsylvania Avenue NW",
    city: "Washington",
    state: "DC",
    ZIPCode: "20500",
  });

  expect(result).toBeDefined();
  console.log(result);
});
