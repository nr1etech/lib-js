import { test, expect } from "vitest";
import { getCityState } from "./get-city-state.js";
import { getClient } from "../helper.test.js";

test("Test getCityState @int", async () => {
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

  const result = await getCityState(client, {
    ZIPCode: "20500",
  });

  expect(result).toBeDefined();
  expect(result.city).toBeDefined();
  expect(result.state).toBeDefined();
  expect(result.ZIPCode).toBeDefined();
  console.log(result);
});
