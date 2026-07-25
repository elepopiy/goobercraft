"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolManager = void 0;
const minecraft_protocol_1 = require("minecraft-protocol");
const Logger_1 = require("../utils/Logger");
const MovementPacketCompat_1 = require("../utils/MovementPacketCompat");
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
        const targetPort = Number(this.options.port) || 25565;
        Logger_1.Logger.info("ProtocolManager", `${this.options.host}:${targetPort} adresine bağlanılıyor...`);
        this.client = (0, minecraft_protocol_1.createClient)({
            host: this.options.host,
            port: targetPort,
            username: this.options.username,
            password: this.options.password,
            // Eğer auth belirtilmediyse varsayılan olarak 'offline' (crackli) giriş yapmayı dener
            auth: this.options.auth || "offline",
            // 'auto' yerine false vermek minecraft-protocol'da versiyon algılamayı daha iyi tetikler
            version: this.options.version === "auto" ? false : this.options.version,
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