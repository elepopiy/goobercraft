import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { Logger } from "../utils/Logger";

/**
 * Sağlığı 0 veya altına düşen bot, ResolvedBotOptions.respawnOnDeath
 * true ise otomatik olarak "respawn" isteği (client_command, action=0)
 * gönderir. Kullanıcının kendisi hiçbir paket göndermek zorunda değildir.
 */
export class RespawnManager {
  private dead = false;

  constructor(
    private readonly bus: EventBus,
    private readonly protocol: ProtocolManager,
    private readonly respawnOnDeath: boolean
  ) {
    this.bus.on("health", (data: { health: number }) => this.handleHealth(data.health));
    this.bus.on("packet:death_combat_event", () => this.handleDeath());
    this.bus.on("packet:combat_event", (data: any) => {
      if (data.event === "death" || data.type === 2) this.handleDeath();
    });
    this.bus.on("packet:respawn", () => {
      this.dead = false;
      this.bus.emit("respawn");
    });
  }

  private handleHealth(health: number): void {
    if (health <= 0 && !this.dead) {
      this.handleDeath();
    }
  }

  private handleDeath(): void {
    if (this.dead) return;
    this.dead = true;
    Logger.info("RespawnManager", "Bot öldü.");
    this.bus.emit("death");

    if (this.respawnOnDeath) {
      this.protocol.write("client_command", { actionId: 0 });
      Logger.info("RespawnManager", "Otomatik respawn isteği gönderildi.");
    }
  }

  isDead(): boolean {
    return this.dead;
  }
}
