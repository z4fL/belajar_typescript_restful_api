import { afterEach, beforeEach, describe, expect, it } from "vitest";
import supertest from "supertest";
import { web } from "../src/lib/web";
import { logger } from "../src/lib/logging";
import { ContactTest, UserTest } from "./test-util";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should not able to create new contact if data is invalid", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        firstName: "",
        lastName: "",
        email: "",
        phone: "0811112233445566",
        note: "contoh note",
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should be able to create new contact", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        firstName: "Dzaky Fadli",
        lastName: "Firmansyah",
        email: "zzz@example.com",
        phone: "081111223344",
        note: "contoh note",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.firstName).toBe("Dzaky Fadli");
    expect(response.body.data.lastName).toBe("Firmansyah");
    expect(response.body.data.email).toBe("zzz@example.com");
    expect(response.body.data.phone).toBe("081111223344");
    expect(response.body.data.note).toBe("contoh note");
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should not able to get contact data if contact is not found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });

  it("should be able to get contact data", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.firstName).toBe("Dzaky Fadli");
    expect(response.body.data.lastName).toBe("Firmansyah");
    expect(response.body.data.email).toBe("zzz@example.com");
    expect(response.body.data.phone).toBe("081111223344");
    expect(response.body.data.note).toBe("contoh note");
  });
});
