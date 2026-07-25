export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";
export declare class Logger {
    private static level;
    static setLevel(level: LogLevel): void;
    private static shouldLog;
    static debug(scope: string, ...args: unknown[]): void;
    static info(scope: string, ...args: unknown[]): void;
    static warn(scope: string, ...args: unknown[]): void;
    static error(scope: string, ...args: unknown[]): void;
}
//# sourceMappingURL=Logger.d.ts.map