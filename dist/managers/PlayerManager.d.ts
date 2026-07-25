import { EventBus } from "../core/EventBus";
import { EntityManager } from "./EntityManager";
import { PlayerData } from "../utils/types";
/**
 * player_info paketleri (tab listesi) üzerinden sunucudaki tüm
 * oyuncuların uuid/username/ping/gamemode bilgisini tutar. Entity ile
 * (görünür model) UUID üzerinden eşleşme kurar.
 */
export declare class PlayerManager {
    private readonly bus;
    private readonly entities;
    private players;
    constructor(bus: EventBus, entities: EntityManager);
    private handlePlayerInfo;
    private handlePlayerRemove;
    private linkEntity;
    private flatten;
    get(uuid: string): PlayerData | undefined;
    byUsername(username: string): PlayerData | undefined;
    all(): PlayerData[];
    clear(): void;
}
//# sourceMappingURL=PlayerManager.d.ts.map