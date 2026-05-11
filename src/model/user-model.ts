import type z from "zod";
import type { UserValidation } from "../validation/user-validation.js";
import type { User } from "../generated/prisma/client.js";

export type UserResponse = {
  username: string;
  name: string;
  birthDate: string;
  gender: string;
  token?: string;
};

export type LoginUserRequest = z.infer<typeof UserValidation.LOGIN>;

export type CreateUserRequest = z.infer<typeof UserValidation.REGISTER>;

export function toUserResponse(user: User): UserResponse {
  return {
    name: user.name,
    username: user.username,
    birthDate: user.birthDate?.toISOString().split("T")[0] ?? "",
    gender: user.gender,
  };
}
