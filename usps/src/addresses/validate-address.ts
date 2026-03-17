import { USPSClient } from "../client.js";

export type ValidateAddressInput = {
  streetAddress: string;
  secondaryAddress?: string;
  city?: string;
  state: string;
  urbanization?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
  firm?: string;
};

export type AddressResponse = {
  firm?: string;
  address?: {
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
  additionalInfo?: {
    deliveryPoint?: string;
    carrierRoute?: string;
    DPVConfirmation?: "Y" | "D" | "S" | "N";
    DPVCMRA?: "Y" | "N";
    business?: "Y" | "N";
    centralDeliveryPoint?: "Y" | "N";
    vacant?: "Y" | "N";
  };
  corrections?: Array<{
    code: string;
    text: string;
  }>;
  matches?: Array<{
    code: string;
    text: string;
  }>;
  warnings?: Array<string>;
};

export async function validateAddress(
  client: USPSClient,
  input: ValidateAddressInput,
): Promise<AddressResponse> {
  const params: Record<string, string> = {
    streetAddress: input.streetAddress,
    state: input.state,
  };
  if (input.secondaryAddress) {
    params.secondaryAddress = input.secondaryAddress;
  }
  if (input.city) {
    params.city = input.city;
  }
  if (input.urbanization) {
    params.urbanization = input.urbanization;
  }
  if (input.ZIPCode) {
    params.ZIPCode = input.ZIPCode;
  }
  if (input.ZIPPlus4) {
    params.ZIPPlus4 = input.ZIPPlus4;
  }
  if (input.firm) {
    params.firm = input.firm;
  }
  return client.get<AddressResponse>({
    path: "/addresses/v3/address",
    params,
  });
}
