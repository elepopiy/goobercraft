import { EventBus } from "../core/EventBus";
import { TeleportManager } from "./TeleportManager";
import { Logger } from "../utils/Logger";

/**
 * "spawn" olayı, Mineflayer'daki gibi botun dünyada gerçekten var
 * olduğu ve konumunun sunucu tarafından onaylandığı ilk an temsil
 * eder. LoginManager'ın 'login' event'i sadece paket akışının
 * tamamlandığını gösterir; asıl kullanışlı olan, ilk position paketi
 * (teleport) alındıktan sonra tetiklenen bu 'spawn' event'idir.
 */
export class SpawnManager {
  private hasSpawned = false;
  private hasLoggedIn = false;

  constructor(private readonly bus: EventBus, private readonly teleport: TeleportManager) {
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

  private maybeSpawn(): void {
    if (this.hasSpawned || !this.hasLoggedIn) return;
    this.hasSpawned = true;
    Logger.info("SpawnManager", "Bot dünyaya spawn oldu.");
    this.bus.emit("spawn");
  }
}
