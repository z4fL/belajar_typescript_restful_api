import { afterEach, beforeEach, describe, expect, it } from "vitest";
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

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should not able to login if username is wrong", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "test-false",
      password: "test123",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should not able to login if password is wrong", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "test-false",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should be able to login", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "test123",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("Dzaky Fadli Firmansyah");
    expect(response.body.data.token).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should not able to get user", async () => {
    const response = await supertest(web)
      .get("/api/users/current")
      .set("X-API-TOKEN", "salah");

    logger.debug(response);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should be able to get user", async () => {
    const response = await supertest(web)
      .get("/api/users/current")
      .set("X-API-TOKEN", "test");

    logger.debug(response);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("Dzaky Fadli Firmansyah");
  });
});
