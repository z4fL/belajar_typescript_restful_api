import { z } from "zod";

export class UserValidation {
  static readonly REGISTER = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(5).max(100),
    name: z.string().min(3).max(100),
    birthDate: z.coerce.date(),
    gender: z.string().min(3).max(10),
  });

  static readonly LOGIN = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(5).max(100),
  });

  static readonly UPDATE = z.object({
    password: z.string().min(5).max(100).optional(),
    name: z.string().min(3).max(100).optional(),
    birthDate: z.coerce.date().optional(),
    gender: z.string().min(3).max(10).optional(),
  });
}
