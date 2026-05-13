import { User } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";

export class UserTest {
  static async delete() {
    await prisma.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  static async create() {
    await prisma.user.create({
      data: {
        username: "test",
        password: await bcrypt.hash("test123", 10),
        name: "Dzaky Fadli Firmansyah",
        birthDate: new Date("2004-07-11"),
        gender: "Male",
        token: "test",
      },
    });
  }

  static async get(): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        username: "test",
      },
    });

    if (!user) {
      throw new Error("User is not found!");
    }
    return user;
  }
}
