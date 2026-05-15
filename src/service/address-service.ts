import { ResponseError } from "../error/response-error.js";
import type { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import {
  toAddressResponse,
  type AddressResponse,
  type CreateAddressRequest,
  type GetAddressRequest,
} from "../model/address-model.js";
import { AddressValidation } from "../validation/address-validation.js";
import { Validation } from "../validation/validation.js";
import { ContactService } from "./contact-service.js";

export class AddressService {
  static async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    const createRequest = Validation.validate(AddressValidation.CREATE, request);
    await ContactService.checkContactMustExists(user.username, request.contactId);

    const record = {
      ...createRequest,
      street: createRequest.street ?? null,
      city: createRequest.city ?? null,
      province: createRequest.province ?? null,
    };

    const address = await prisma.address.create({
      data: record,
    });

    return toAddressResponse(address);
  }

  static async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const getRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.checkContactMustExists(user.username, request.contactId);

    const address = await prisma.address.findFirst({
      where: {
        id: getRequest.id,
        contactId: getRequest.contactId,
      },
    });

    if (!address) throw new ResponseError(404, "Address is not found!");

    return toAddressResponse(address);
  }
}
