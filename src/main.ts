import { logger } from "./lib/logging.js";
import { web } from "./lib/web.js";

web.listen(3000, () => {
  logger.info("Listening on port 3000")
})