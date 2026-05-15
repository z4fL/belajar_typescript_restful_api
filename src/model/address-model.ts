import type z from "zod";
import type { Address } from "../generated/prisma/client.js";
import type { AddressValidation } from "../validation/address-validation.js";

export type AddressResponse = {
  id: number;
  label: string;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postalCode: string;
};

export type CreateAddressRequest = z.infer<typeof AddressValidation.CREATE>;

export type GetAddressRequest = z.infer<typeof AddressValidation.GET>;

export function toAddressResponse(address: Address): AddressResponse {
  return {
    id: address.id,
    label: address.label,
    street: address.street,
    city: address.city,
    province: address.province,
    country: address.country,
    postalCode: address.postalCode,
  };
}
