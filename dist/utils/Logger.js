"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const LEVEL_WEIGHT = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    silent: 4,
};
class Logger {
    static level = process.env.GOOBERCRAFT_LOG_LEVEL || "info";
    static setLevel(level) {
        Logger.level = level;
    }
    static shouldLog(level) {
        return LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[Logger.level];
    }
    static debug(scope, ...args) {
        if (Logger.shouldLog("debug"))
            console.debug(`[GooberCraft:${scope}]`, ...args);
    }
    static info(scope, ...args) {
        if (Logger.shouldLog("info"))
            console.log(`[GooberCraft:${scope}]`, ...args);
    }
    static warn(scope, ...args) {
        if (Logger.shouldLog("warn"))
            console.warn(`[GooberCraft:${scope}]`, ...args);
    }
    static error(scope, ...args) {
        if (Logger.shouldLog("error"))
            console.error(`[GooberCraft:${scope}]`, ...args);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map