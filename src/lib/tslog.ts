import { Logger } from "tslog";

export const logger = new Logger({ name: "root" });

export const createSubLogger = (name: string) =>
  logger.getSubLogger({
    name,
  });
