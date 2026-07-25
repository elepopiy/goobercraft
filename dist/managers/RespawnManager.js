"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespawnManager = void 0;
const Logger_1 = require("../utils/Logger");
/**
 * Sağlığı 0 veya altına düşen bot, ResolvedBotOptions.respawnOnDeath
 * true ise otomatik olarak "respawn" isteği (client_command, action=0)
 * gönderir. Kullanıcının kendisi hiçbir paket göndermek zorunda değildir.
 */
class RespawnManager {
    bus;
    protocol;
    respawnOnDeath;
    dead = false;
    constructor(bus, protocol, respawnOnDeath) {
        this.bus = bus;
        this.protocol = protocol;
        this.respawnOnDeath = respawnOnDeath;
        this.bus.on("health", (data) => this.handleHealth(data.health));
        this.bus.on("packet:death_combat_event", () => this.handleDeath());
        this.bus.on("packet:combat_event", (data) => {
            if (data.event === "death" || data.type === 2)
                this.handleDeath();
        });
        this.bus.on("packet:respawn", () => {
            this.dead = false;
            this.bus.emit("respawn");
        });
    }
    handleHealth(health) {
        if (health <= 0 && !this.dead) {
            this.handleDeath();
        }
    }
    handleDeath() {
        if (this.dead)
            return;
        this.dead = true;
        Logger_1.Logger.info("RespawnManager", "Bot öldü.");
        this.bus.emit("death");
        if (this.respawnOnDeath) {
            this.protocol.write("client_command", { actionId: 0 });
            Logger_1.Logger.info("RespawnManager", "Otomatik respawn isteği gönderildi.");
        }
    }
    isDead() {
        return this.dead;
    }
}
exports.RespawnManager = RespawnManager;
//# sourceMappingURL=RespawnManager.js.map