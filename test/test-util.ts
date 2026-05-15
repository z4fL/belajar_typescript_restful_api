import { Address, Contact, User } from "../src/generated/prisma/client";
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

export class ContactTest {
  static async deleteAll() {
    await prisma.contact.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  static async create() {
    await prisma.contact.create({
      data: {
        firstName: "Dzaky Fadli",
        lastName: "Firmansyah",
        email: "zzz@example.com",
        phone: "081111223344",
        note: "contoh note",
        username: "test",
      },
    });
  }

  static async get(): Promise<Contact> {
    const contact = await prisma.contact.findFirst({
      where: {
        username: "test",
      },
    });

    if (!contact) {
      throw new Error("Contact not found!");
    }

    return contact;
  }
}

export class AddressTest {
  static async deleteAll() {
    await prisma.address.deleteMany({
      where: {
        contact: {
          username: "test",
        },
      },
    });
  }

  static async create() {
    const contact = await ContactTest.get();
    await prisma.address.create({
      data: {
        contactId: contact.id,
        label: "HOME",
        street: "Jalan Desa",
        city: "Purbalingga",
        province: "Jawa Tengah",
        country: "Indonesia",
        postalCode: "53398",
      },
    });
  }

  static async get(): Promise<Address> {
    const address = await prisma.address.findFirst({
      where: {
        contact: { username: "test" },
      },
    });

    if (!address) throw new Error("Address is not found!");

    return address;
  }
}
