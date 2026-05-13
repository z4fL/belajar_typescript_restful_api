import { z } from "zod";

export class ContactValidation {
  static readonly CREATE = z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100).optional(),
    email: z.email().min(1).max(100).optional(),
    phone: z.string().min(1).max(15),
    note: z.string().min(1).max(100).optional(),
  });
}
