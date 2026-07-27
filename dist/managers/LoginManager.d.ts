import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { ResolvedBotOptions } from "../utils/types";
/**
 * minecraft-protocol; handshake, encryption ve compression'ı zaten
 * kendi içinde otomatik yürütür. LoginManager'ın sorumluluğu, login
 * tamamlandıktan sonraki "configuration" state'inde (1.20.2+) sunucunun
 * beklediği client_information ve finish_configuration paketlerini
 * otomatik göndermek, ve login/join_game paketini yakalayıp bot'un
 * temel oyun durumunu (entityId, dünya adı, gamemode vb.) doldurmaktır.
 */
export declare class LoginManager {
    private readonly bus;
    private readonly protocol;
    private readonly options;
    playerEntityId: number | null;
    gamemode: number;
    dimension: string | number | null;
    loggedIn: boolean;
    private hasEnteredPlayState;
    private hasSeenJoinPacket;
    private loginEmitted;
    constructor(bus: EventBus, protocol: ProtocolManager, options: ResolvedBotOptions);
    private handleStateChange;
    private tryEmitLogin;
    private sendClientInformation;
    finishConfiguration(): void;
    private handleJoinGame;
    private handleRespawnGamemode;
}
//# sourceMappingURL=LoginManager.d.ts.map