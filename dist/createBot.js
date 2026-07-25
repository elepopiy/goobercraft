"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBot = createBot;
const Bot_1 = require("./Bot");
const DEFAULTS = {
    port: 25565,
    auth: "offline",
    version: "1.20.4",
    viewDistance: 8,
    checkTimeoutInterval: 30000,
    respawnOnDeath: true,
};
function resolveOptions(options) {
    if (!options.host)
        throw new Error("GooberCraft: 'host' zorunludur.");
    if (!options.username)
        throw new Error("GooberCraft: 'username' zorunludur.");
    return {
        host: options.host,
        username: options.username,
        password: options.password,
        port: options.port ?? DEFAULTS.port,
        auth: options.auth ?? DEFAULTS.auth,
        version: options.version ?? DEFAULTS.version,
        viewDistance: options.viewDistance ?? DEFAULTS.viewDistance,
        checkTimeoutInterval: options.checkTimeoutInterval ?? DEFAULTS.checkTimeoutInterval,
        respawnOnDeath: options.respawnOnDeath ?? DEFAULTS.respawnOnDeath,
    };
}
/**
 * GooberCraft'ın tek genel fabrika fonksiyonu. Bir Bot örneği oluşturur,
 * bağlantıyı hemen başlatır ve döner. Kullanıcının hiçbir şekilde ham
 * paket yazmasına veya handshake/login/configuration adımlarını elle
 * yürütmesine gerek yoktur — tamamı otomatiktir.
 */
function createBot(options) {
    const resolved = resolveOptions(options);
    const bot = new Bot_1.Bot(resolved);
    bot.connect();
    return bot;
}
//# sourceMappingURL=createBot.js.map