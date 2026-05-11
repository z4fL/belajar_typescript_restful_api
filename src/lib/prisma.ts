import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { logger } from "./logging.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prisma.$on("query", (e) => {
  logger.info({
    query: e.query.replace(/"/g, "").replace(/\s+/g, " ").trim(),
    params: JSON.parse(e.params),
    duration: `${e.duration.toFixed(2)}ms`,
  });
});

prisma.$on("error", (e) => {
  logger.error(e.message);
});

prisma.$on("warn", (e) => {
  logger.warn(e.message);
});

prisma.$on("info", (e) => {
  logger.info(e.message);
});

export { prisma };
