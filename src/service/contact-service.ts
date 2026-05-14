import { ResponseError } from "../error/response-error.js";
import type { User } from "../generated/prisma/client.js";
import { logger } from "../lib/logging.js";
import { prisma } from "../lib/prisma.js";
import {
  toCreateResponse,
  type ContactResponse,
  type CreateContactRequest,
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

  static async get(user: User, id: number): Promise<ContactResponse> {
    const contactId = id;
    if (isNaN(contactId) || contactId <= 0) {
      throw new ResponseError(400, "Invalid contact id");
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        username: user.username,
      },
    });

    if (!contact) {
      throw new ResponseError(404, "Contact not found!");
    }

    return toCreateResponse(contact);
  }
}
