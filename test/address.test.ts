import { afterEach, beforeEach, describe, expect, it } from "vitest";
import supertest from "supertest";
import { web } from "../src/lib/web";
import { logger } from "../src/lib/logging";
import { AddressTest, ContactTest, UserTest } from "./test-util";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should not able to create new address if contact is not found", async () => {
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .post(`/api/contacts/${contact.id + 1}/addresses`)
      .set("X-API-TOKEN", "test")
      .send({
        label: "HOME",
        street: "Jalan Desa",
        city: "Purbalingga",
        province: "Jawa Tengah",
        country: "Indonesia",
        postalCode: "53398",
      });

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });

  it("should be able to create new address", async () => {
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "test")
      .send({
        label: "HOME",
        street: "Jalan Desa",
        city: "Purbalingga",
        province: "Jawa Tengah",
        country: "Indonesia",
        postalCode: "53398",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.label).toBe("HOME");
    expect(response.body.data.street).toBe("Jalan Desa");
    expect(response.body.data.city).toBe("Purbalingga");
    expect(response.body.data.province).toBe("Jawa Tengah");
    expect(response.body.data.country).toBe("Indonesia");
    expect(response.body.data.postalCode).toBe("53398");
  });
});
