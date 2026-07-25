import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
/**
 * Sağlığı 0 veya altına düşen bot, ResolvedBotOptions.respawnOnDeath
 * true ise otomatik olarak "respawn" isteği (client_command, action=0)
 * gönderir. Kullanıcının kendisi hiçbir paket göndermek zorunda değildir.
 */
export declare class RespawnManager {
    private readonly bus;
    private readonly protocol;
    private readonly respawnOnDeath;
    private dead;
    constructor(bus: EventBus, protocol: ProtocolManager, respawnOnDeath: boolean);
    private handleHealth;
    private handleDeath;
    isDead(): boolean;
}
//# sourceMappingURL=RespawnManager.d.ts.map