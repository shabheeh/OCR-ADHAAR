import morgan from "morgan";
import { logger } from "../../utils/logger.util";

const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export const httpLogger = morgan("combined", { stream });
