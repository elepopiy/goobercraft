export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

export class Logger {
  private static level: LogLevel = (process.env.GOOBERCRAFT_LOG_LEVEL as LogLevel) || "info";

  static setLevel(level: LogLevel): void {
    Logger.level = level;
  }

  private static shouldLog(level: LogLevel): boolean {
    return LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[Logger.level];
  }

  static debug(scope: string, ...args: unknown[]): void {
    if (Logger.shouldLog("debug")) console.debug(`[GooberCraft:${scope}]`, ...args);
  }

  static info(scope: string, ...args: unknown[]): void {
    if (Logger.shouldLog("info")) console.log(`[GooberCraft:${scope}]`, ...args);
  }

  static warn(scope: string, ...args: unknown[]): void {
    if (Logger.shouldLog("warn")) console.warn(`[GooberCraft:${scope}]`, ...args);
  }

  static error(scope: string, ...args: unknown[]): void {
    if (Logger.shouldLog("error")) console.error(`[GooberCraft:${scope}]`, ...args);
  }
}
