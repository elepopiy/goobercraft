"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnManager = void 0;
const Logger_1 = require("../utils/Logger");
/**
 * "spawn" olayı, Mineflayer'daki gibi botun dünyada gerçekten var
 * olduğu ve konumunun sunucu tarafından onaylandığı ilk an temsil
 * eder. LoginManager'ın 'login' event'i sadece paket akışının
 * tamamlandığını gösterir; asıl kullanışlı olan, ilk position paketi
 * (teleport) alındıktan sonra tetiklenen bu 'spawn' event'idir.
 */
class SpawnManager {
    bus;
    teleport;
    hasSpawned = false;
    hasLoggedIn = false;
    constructor(bus, teleport) {
        this.bus = bus;
        this.teleport = teleport;
        this.bus.on("login", () => {
            this.hasLoggedIn = true;
        });
        this.bus.on("teleported", () => this.maybeSpawn());
        this.bus.on("packet:respawn", () => {
            // Respawn sonrası tekrar spawn edilebilir olmalı (RespawnManager
            // tarafından ayrıca 'respawn' event'i de yayınlanır).
            this.hasSpawned = false;
        });
    }
    maybeSpawn() {
        if (this.hasSpawned || !this.hasLoggedIn)
            return;
        this.hasSpawned = true;
        Logger_1.Logger.info("SpawnManager", "Bot dünyaya spawn oldu.");
        this.bus.emit("spawn");
    }
}
exports.SpawnManager = SpawnManager;
//# sourceMappingURL=SpawnManager.js.map