import { Logger } from "tslog";

export const logger = new Logger({ name: "root" });

export const createSubLogger = (name: string) =>
  logger.getSubLogger({
    minLevel: 3,
    name,
    prettyLogTemplate: "{{logLevelName}}\t[{{name}}]\t",
    prettyInspectOptions: {
      depth: 10,
    },
  });
