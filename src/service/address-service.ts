import { ResponseError } from "../error/response-error.js";
import type { Address, User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import {
  toAddressResponse,
  type AddressResponse,
  type CreateAddressRequest,
  type GetAddressRequest,
  type RemoveAddressRequest,
  type UpdateAddressRequest,
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

  static async checkAddressMustExists(
    contactId: number,
    addressId: number,
  ): Promise<Address> {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        contactId: contactId,
      },
    });

    if (!address) throw new ResponseError(404, "Address is not found!");

    return address;
  }

  static async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const getRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.checkContactMustExists(user.username, request.contactId);

    const address = await this.checkAddressMustExists(
      getRequest.contactId,
      getRequest.id,
    );

    return toAddressResponse(address);
  }

  static async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    const updateRequest = Validation.validate(AddressValidation.UPDATE, request);
    await ContactService.checkContactMustExists(user.username, request.contactId);
    await this.checkAddressMustExists(updateRequest.contactId, updateRequest.id);

    const record = {
      ...updateRequest,
      street: updateRequest.street ?? null,
      city: updateRequest.city ?? null,
      province: updateRequest.province ?? null,
    };

    const address = await prisma.address.update({
      where: {
        id: updateRequest.id,
        contactId: updateRequest.contactId,
      },
      data: record,
    });

    return toAddressResponse(address);
  }

  static async remove(
    user: User,
    request: RemoveAddressRequest,
  ): Promise<AddressResponse> {
    const removeRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.checkContactMustExists(user.username, request.contactId);
    await this.checkAddressMustExists(removeRequest.contactId, removeRequest.id);

    const address = await prisma.address.delete({
      where: { id: removeRequest.id },
    });

    return toAddressResponse(address);
  }

  static async list(user: User, contactId: number): Promise<Array<AddressResponse>> {
    await ContactService.checkContactMustExists(user.username, contactId);

    const addresses = await prisma.address.findMany({
      where: { contactId: contactId },
    });

    return addresses.map((address) => toAddressResponse(address));
  }
}
