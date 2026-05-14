import type z from "zod";
import type { Contact } from "../generated/prisma/client.js";
import type { ContactValidation } from "../validation/contact-validation.js";

export type ContactResponse = {
  id: number;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone: string;
  note?: string | null;
};

export type CreateContactRequest = z.infer<typeof ContactValidation.CREATE>;

export type UpdateContactRequest = z.infer<typeof ContactValidation.UPDATE>;

export function toCreateResponse(contact: Contact): ContactResponse {
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    note: contact.note,
  };
}
