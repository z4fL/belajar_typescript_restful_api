import bcrypt from "bcrypt";
import { ResponseError } from "../error/response-error.js";
import { prisma } from "../lib/prisma.js";
import {
  toUserResponse,
  type CreateUserRequest,
  type UserResponse,
} from "../model/user-model.js";
import { UserValidation } from "../validation/user-validation.js";
import { Validation } from "../validation/validation.js";

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await prisma.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new ResponseError(400, "Username already Exists");
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await prisma.user.create({
      data: registerRequest,
    });

    return toUserResponse(user);
  }
}
