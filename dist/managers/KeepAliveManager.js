"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeepAliveManager = void 0;
const Logger_1 = require("../utils/Logger");
/**
 * Sunucudan gelen her keep_alive paketine, kullanıcı hiçbir şey
 * yapmadan otomatik olarak aynı id ile cevap verir. Bu olmazsa
 * sunucu botu birkaç saniye içinde zaman aşımına uğratıp atar.
 */
class KeepAliveManager {
    bus;
    protocol;
    lastKeepAliveAt = 0;
    missed = 0;
    constructor(bus, protocol) {
        this.bus = bus;
        this.protocol = protocol;
        this.bus.on("packet:keep_alive", (data) => this.handleKeepAlive(data));
    }
    handleKeepAlive(data) {
        const id = data.keepAliveId;
        this.lastKeepAliveAt = Date.now();
        this.missed = 0;
        this.protocol.write("keep_alive", { keepAliveId: id });
        Logger_1.Logger.debug("KeepAliveManager", `keep_alive yanıtlandı: ${id?.toString?.() ?? id}`);
    }
    getLastKeepAliveAt() {
        return this.lastKeepAliveAt;
    }
}
exports.KeepAliveManager = KeepAliveManager;
//# sourceMappingURL=KeepAliveManager.js.map