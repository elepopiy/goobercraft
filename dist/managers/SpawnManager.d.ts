import { EventBus } from "../core/EventBus";
import { TeleportManager } from "./TeleportManager";
/**
 * "spawn" olayı, Mineflayer'daki gibi botun dünyada gerçekten var
 * olduğu ve konumunun sunucu tarafından onaylandığı ilk an temsil
 * eder. LoginManager'ın 'login' event'i sadece paket akışının
 * tamamlandığını gösterir; asıl kullanışlı olan, ilk position paketi
 * (teleport) alındıktan sonra tetiklenen bu 'spawn' event'idir.
 */
export declare class SpawnManager {
    private readonly bus;
    private readonly teleport;
    private hasSpawned;
    private hasLoggedIn;
    constructor(bus: EventBus, teleport: TeleportManager);
    private maybeSpawn;
}
//# sourceMappingURL=SpawnManager.d.ts.map