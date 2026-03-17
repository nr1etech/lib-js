import { USPSClient } from "../client.js";

export type GetZIPCodeInput = {
  streetAddress: string;
  city: string;
  state: string;
  secondaryAddress?: string;
  firm?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
};

export type ZIPCodeResponse = {
  firm?: string;
  address: {
    streetAddress: string;
    streetAddressAbbreviation?: string;
    secondaryAddress?: string;
    cityAbbreviation?: string;
    city: string;
    state: string;
    ZIPCode: string;
    ZIPPlus4?: string | null;
    urbanization?: string;
  };
};

export async function getZIPCode(
  client: USPSClient,
  input: GetZIPCodeInput,
): Promise<ZIPCodeResponse> {
  const params: Record<string, string> = {
    streetAddress: input.streetAddress,
    city: input.city,
    state: input.state,
  };
  if (input.secondaryAddress) {
    params.secondaryAddress = input.secondaryAddress;
  }
  if (input.firm) {
    params.firm = input.firm;
  }
  if (input.ZIPCode) {
    params.ZIPCode = input.ZIPCode;
  }
  if (input.ZIPPlus4) {
    params.ZIPPlus4 = input.ZIPPlus4;
  }
  return client.get<ZIPCodeResponse>({
    path: "/addresses/v3/zipcode",
    params,
  });
}
