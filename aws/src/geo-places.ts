import {
  AutocompleteCommand,
  AutocompleteCommandInput,
  AutocompleteCommandOutput,
  AutocompleteIntendedUse,
  GeocodeCommand,
  GeocodeCommandInput,
  GeocodeCommandOutput,
  GeoPlacesClient,
  SearchTextCommand,
  SearchTextCommandInput,
  SearchTextCommandOutput,
  SuggestCommand,
  SuggestCommandInput,
  SuggestCommandOutput,
} from '@aws-sdk/client-geo-places';
import {getAwsRegion} from './region.js';

export {
  AutocompleteCommand,
  AutocompleteCommandInput,
  AutocompleteCommandOutput,
  GeocodeCommand,
  GeocodeCommandInput,
  GeocodeCommandOutput,
  SearchTextCommand,
  SearchTextCommandInput,
  SearchTextCommandOutput,
  SuggestCommand,
  SuggestCommandInput,
  SuggestCommandOutput,
};

const geoPlacesClients = new Map<string, GeoPlacesClient>();

export function getGeoPlacesClient(region?: string) {
  const regionKey = region || getAwsRegion();
  let client = geoPlacesClients.get(regionKey);
  if (!client) {
    client = new GeoPlacesClient({region: regionKey});
    geoPlacesClients.set(regionKey, client);
  }
  return client;
}

export const BiasPosition = {
  Africa: [20.0, 5.0],
  Asia: [85.0, 35.0],
  Australia: [134.0, -25.0],
  Europe: [10.0, 50.0],
  Canada: [-96.0, 62.0],
  SouthAfrica: [24.0, -29.0],
  SouthAmerica: [-60.0, -15.0],
  Us: [-98.5795, 39.8283],
};

/**
 * Provides basic geocoding functionality to cover most use cased.
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-geo-places/
 *
 * @param address - The address to geocode.
 * @param biasPosition - A latitude and longitude to bias the search towards. Defaults to the US.
 * @param client - The client to use for the request. One will be created if not provided.
 */
export async function geoCodeAddress(
  address: string,
  biasPosition?: [number, number],
  client?: GeoPlacesClient,
): Promise<GeocodeCommandOutput> {
  client = client || getGeoPlacesClient();
  return await client.send(
    new GeocodeCommand({
      QueryText: address,
      MaxResults: 5,
      BiasPosition: biasPosition || BiasPosition.Us,
    }),
  );
}

/**
 * Provides basic geo-location for an address to cover most use cases.
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-geo-places/
 *
 * @param address - The address to geolocate.
 * @param biasPosition - A latitude and longitude to bias the search towards. Defaults to the US.
 * @param client - The client to use for the request. One will be created if not provided.
 */
export async function geoLocateAddress(
  address: string,
  biasPosition?: [number, number],
  client?: GeoPlacesClient,
): Promise<SearchTextCommandOutput> {
  client = client || getGeoPlacesClient();
  return await client.send(
    new SearchTextCommand({
      QueryText: address,
      MaxResults: 5,
      BiasPosition: biasPosition || BiasPosition.Us,
    }),
  );
}

/**
 * Provides basic address autocomplete functionality.
 @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-geo-places/

 * @param address - The address to autocomplete.
 * @param biasPosition - A latitude and longitude to bias the search towards. Defaults to the US.
 * @param client - The client to use for the request. One will be created if not provided.
 */
export async function autocompleteAddress(
  address: string,
  biasPosition?: [number, number],
  client?: GeoPlacesClient,
): Promise<AutocompleteCommandOutput> {
  client = client || getGeoPlacesClient();
  return await client.send(
    new AutocompleteCommand({
      QueryText: address,
      MaxResults: 5,
      BiasPosition: biasPosition || BiasPosition.Us,
      IntendedUse: AutocompleteIntendedUse.SINGLE_USE,
    }),
  );
}

/**
 * Provides basic location suggestion functionality.
 *
 * @param address - The address to suggest.
 * @param biasPosition - A latitude and longitude to bias the search towards. Defaults to the US.
 * @param client - The client to use for the request. One will be created if not provided.
 */
export async function suggestLocation(
  address: string,
  biasPosition?: [number, number],
  client?: GeoPlacesClient,
): Promise<SuggestCommandOutput> {
  client = client || getGeoPlacesClient();
  return await client.send(
    new SuggestCommand({
      QueryText: address,
      MaxResults: 5,
      BiasPosition: biasPosition || BiasPosition.Us,
    }),
  );
}
