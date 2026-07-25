"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolManager = void 0;
const minecraft_protocol_1 = require("minecraft-protocol");
const Logger_1 = require("../utils/Logger");
const MovementPacketCompat_1 = require("../utils/MovementPacketCompat");
/**
 * ProtocolManager, minecraft-protocol'un düşük seviye Client'ını yönetir.
 * Handshake, login, configuration, compression ve encryption tamamen
 * minecraft-protocol tarafından otomatik yürütülür (bu kütüphanenin
 * sorumluluğu değildir) — GooberCraft'ın işi bu client'tan gelen
 * paketleri kendi EventBus'ına aktarmak ve giden paketleri tek bir
 * merkezi yerden yazmaktır.
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
        // Her paket, ham haliyle EventBus üzerinden yayınlanır. Manager'lar
        // ilgilendikleri paket adına abone olur (packet:<name>).
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
    /**
     * Bağlı olunan sunucunun (negotiated) protokol sürümünü döndürür.
     * Henüz bağlanılmadıysa veya sürüm bilinmiyorsa undefined döner.
     */
    getVersion() {
        return this.client?.version;
    }
    /**
     * Serverbound "Move Player" ailesi paketleri (position, look,
     * position_look, vehicle_move vb.) için onGround/horizontalCollision
     * alanlarını sürüme uygun şekilde oluşturup gönderir.
     *
     * Minecraft 1.21.2 ile bu paketlerdeki "on ground" alanı düz bir
     * boolean olmaktan çıkıp bir bitfield'a ("flags") taşındı. Alan adını
     * sabit kodlamak yerine gerçek protodef şeması çalışma zamanında
     * incelenir (bkz. MovementPacketCompat) — böylece hem eski hem yeni
     * sürümlerde doğru paket üretilir. Şema çözülemezse veya yazma
     * başarısız olursa istisna burada yutulur: hareket paketi o an
     * gönderilemeyebilir, ama bağlantı asla bu yüzden kopmaz.
     */
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