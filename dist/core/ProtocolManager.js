"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolManager = void 0;
const minecraft_protocol_1 = require("minecraft-protocol");
const Logger_1 = require("../utils/Logger");
const MovementPacketCompat_1 = require("../utils/MovementPacketCompat");
const managers_1 = require("../managers"); // 👈 MANAGER IMPORT'U EKLENDİ
/**
 * ProtocolManager, minecraft-protocol'un düşük seviye Client'ını yönetir.
 */
class ProtocolManager {
    client;
    options;
    bus;
    closed = false;
    constructor(options, bus) {
        this.options = options;
        this.bus = bus;
    }
    connect() {
        // 🚀 CANLI KAYIT KANCASI (HOOK):
        // Bot ne zaman bağlanmaya çalışsa, Master Node yoksa anında oluşturulur ve aktif kılınır!
        if (managers_1.manager && managers_1.manager.nodes) {
            managers_1.manager.nodes.registerNode({
                id: "master-node-1",
                name: "GooberCraft Master Node",
                url: "http://localhost:10000",
                maxBots: 10
            });
        }
        Logger_1.Logger.info("ProtocolManager", `${this.options.host}:${this.options.port} adresine bağlanılıyor...`);
        this.client = (0, minecraft_protocol_1.createClient)({
            host: this.options.host,
            port: this.options.port,
            username: this.options.username,
            password: this.options.password,
            auth: this.options.auth,
            version: this.options.version === "auto" ? undefined : this.options.version,
            checkTimeoutInterval: this.options.checkTimeoutInterval,
            keepAlive: false, // KeepAliveManager kendi mantığını yürütecek
        });
        const client = this.client;
        client.on("connect", () => this.bus.emit("_raw_connect"));
        client.on("disconnect", (data) => this.bus.emit("_raw_disconnect", data));
        client.on("end", (reason) => this.bus.emit("_raw_end", reason));
        client.on("error", (err) => this.bus.emit("_raw_error", err));
        client.on("kick_disconnect", (data) => this.bus.emit("_raw_kick", data));
        client.on("state", (newState) => this.bus.emit("_raw_state", newState));
        client.on("packet", (data, meta) => {
            this.bus.emit(`packet:${meta.name}`, data, meta);
            this.bus.emit("packet", data, meta);
        });
    }
    write(name, params) {
        if (this.closed || !this.client)
            return;
        try {
            this.client.write(name, params);
        }
        catch (err) {
            Logger_1.Logger.error("ProtocolManager", `'${name}' paketi yazılamadı:`, err);
        }
    }
    getVersion() {
        return this.client?.version;
    }
    writeMovement(name, protodefTypeName, base, flags) {
        if (this.closed || !this.client)
            return;
        try {
            const mcData = (0, MovementPacketCompat_1.getMcData)(this.getVersion());
            const groundFields = (0, MovementPacketCompat_1.buildGroundFields)(mcData, protodefTypeName, flags);
            this.write(name, { ...base, ...groundFields });
        }
        catch (err) {
            Logger_1.Logger.error("ProtocolManager", `'${name}' hareket paketi oluşturulamadı, bu tick atlanıyor:`, err);
        }
    }
    end(reason) {
        if (this.closed)
            return;
        this.closed = true;
        try {
            this.client?.end(reason ?? "disconnect.quitting");
        }
        catch {
            // client zaten kapanmış olabilir
        }
    }
    isClosed() {
        return this.closed;
    }
}
exports.ProtocolManager = ProtocolManager;
//# sourceMappingURL=ProtocolManager.js.map