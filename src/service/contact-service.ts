import { ResponseError } from "../error/response-error.js";
import type { Contact, User } from "../generated/prisma/client.js";
import { logger } from "../lib/logging.js";
import { prisma } from "../lib/prisma.js";
import {
  toCreateResponse,
  type ContactResponse,
  type CreateContactRequest,
  type UpdateContactRequest,
} from "../model/contact-model.js";
import { ContactValidation } from "../validation/contact-validation.js";
import { Validation } from "../validation/validation.js";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    const createRequest = Validation.validate(ContactValidation.CREATE, request);

    const record = {
      ...createRequest,
      lastName: createRequest.lastName ?? null,
      email: createRequest.email ?? null,
      note: createRequest.note ?? null,
      username: user.username,
    };

    const contact = await prisma.contact.create({
      data: record,
    });

    return toCreateResponse(contact);
  }

  static async checkContactMustExists(
    username: string,
    contactId: number,
  ): Promise<Contact> {
    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
        username: username,
      },
    });

    if (!contact) {
      throw new ResponseError(404, "Contact not found!");
    }

    return contact;
  }

  static async get(user: User, id: number): Promise<ContactResponse> {
    if (isNaN(id) || id <= 0) {
      throw new ResponseError(400, "Invalid contact id");
    }

    const contact = await this.checkContactMustExists(user.username, id);

    return toCreateResponse(contact);
  }

  static async update(
    user: User,
    request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const updateRequest = Validation.validate(ContactValidation.UPDATE, request);
    await this.checkContactMustExists(user.username, updateRequest.id);

    const record = {
      ...updateRequest,
      lastName: updateRequest.lastName ?? null,
      email: updateRequest.email ?? null,
      note: updateRequest.note ?? null,
    };

    const contact = await prisma.contact.update({
      where: {
        id: updateRequest.id,
        username: user.username,
      },
      data: record,
    });

    return toCreateResponse(contact);
  }

  static async remove(user: User, id: number): Promise<ContactResponse> {
    await this.checkContactMustExists(user.username, id);

    const contact = await prisma.contact.delete({
      where: {
        id: id,
        username: user.username,
      },
    });

    return toCreateResponse(contact);
  }
}
