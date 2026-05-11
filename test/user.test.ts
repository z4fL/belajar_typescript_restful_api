import { afterEach, describe, expect, it } from "vitest";
import supertest from "supertest";
import { web } from "../src/lib/web";
import { logger } from "../src/lib/logging";
import { UserTest } from "./test-util";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject register new user if request is invalid", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
      birthDate: "",
      gender: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should allow register new user if request is valid", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "test",
      password: "wowow",
      name: "Dzaky Fadli Firmansyah",
      birthDate: "2004-07-11",
      gender: "Male",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("Dzaky Fadli Firmansyah");
  });
});
