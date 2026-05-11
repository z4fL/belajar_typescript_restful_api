import winston from "winston";

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ level, message }) => {
      if (typeof message === "object") {
        return `${level}: ${JSON.stringify(message, null, 2)}`;
      }

      return `${level}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});
