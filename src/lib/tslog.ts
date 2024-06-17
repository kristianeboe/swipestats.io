import { Logger } from "tslog";

export const logger = new Logger({ name: "root" });

export const createSubLogger = (name: string) =>
  logger.getSubLogger({
    name,
  });

const createTimedLogger = () => {
  const logger = new Logger();
  let lastLogTime = Date.now();

  return (message: string) => {
    const currentTime = Date.now();
    const timeSinceLastLog = currentTime - lastLogTime;
    logger.info(`${message} (Time since last log: ${timeSinceLastLog} ms)`);
    lastLogTime = currentTime;
  };
};
