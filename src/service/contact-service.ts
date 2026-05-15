import { ResponseError } from "../error/response-error.js";
import type { Contact, User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import {
  toContactResponse,
  type ContactResponse,
  type CreateContactRequest,
  type SearchContactRequest,
  type UpdateContactRequest,
} from "../model/contact-model.js";
import type { Pagable } from "../model/page.js";
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

    return toContactResponse(contact);
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

    return toContactResponse(contact);
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

    return toContactResponse(contact);
  }

  static async remove(user: User, id: number): Promise<ContactResponse> {
    await this.checkContactMustExists(user.username, id);

    const contact = await prisma.contact.delete({
      where: {
        id: id,
        username: user.username,
      },
    });

    return toContactResponse(contact);
  }

  static async search(
    user: User,
    request: SearchContactRequest,
  ): Promise<Pagable<ContactResponse>> {
    const searchRequest = Validation.validate(ContactValidation.SEARCH, request);
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters = [];
    // check if name is exists
    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            firstName: {
              contains: searchRequest.name,
            },
          },
          {
            lastName: {
              contains: searchRequest.name,
            },
          },
        ],
      });
    }
    // check if email is exists
    if (searchRequest.email) {
      filters.push({
        email: {
          contains: searchRequest.email,
        },
      });
    }
    // check if email is exists
    if (searchRequest.phone) {
      filters.push({
        phone: {
          contains: searchRequest.phone,
        },
      });
    }

    const contacts = await prisma.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await prisma.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.page),
        current_page: searchRequest.page,
      },
    };
  }
}
