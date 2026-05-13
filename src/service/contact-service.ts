import type { User } from "../generated/prisma/client.js";
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
}
