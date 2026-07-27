import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { Logger } from "../utils/Logger";
import { ResolvedBotOptions } from "../utils/types";

/**
 * minecraft-protocol; handshake, encryption ve compression'ı zaten
 * kendi içinde otomatik yürütür. LoginManager'ın sorumluluğu, login
 * tamamlandıktan sonraki "configuration" state'inde (1.20.2+) sunucunun
 * beklediği client_information ve finish_configuration paketlerini
 * otomatik göndermek, ve login/join_game paketini yakalayıp bot'un
 * temel oyun durumunu (entityId, dünya adı, gamemode vb.) doldurmaktır.
 */
export class LoginManager {
  public playerEntityId: number | null = null;
  public gamemode = 0;
  public dimension: string | number | null = null;
  public loggedIn = false;

  private hasEnteredPlayState = false;
  private hasSeenJoinPacket = false;
  private loginEmitted = false;

  constructor(
    private readonly bus: EventBus,
    private readonly protocol: ProtocolManager,
    private readonly options: ResolvedBotOptions
  ) {
    this.bus.on("_raw_state", (state: string) => this.handleStateChange(state));
    this.bus.on("_raw_playerJoin", () => this.tryEmitLogin());
    this.bus.on("packet:login", (data: any) => this.handleJoinGame(data));
    this.bus.on("packet:join_game", (data: any) => this.handleJoinGame(data));
    this.bus.on("packet:respawn", (data: any) => this.handleRespawnGamemode(data));
    this.bus.on("packet:server_data", () => {
      /* sunucu meta verisi - şimdilik sadece gözlemleniyor */
    });
  }

  private handleStateChange(state: string): void {
    Logger.info("LoginManager", `protokol durumu değişti: ${state}`);
    if (state === "configuration") {
      this.sendClientInformation();
      this.finishConfiguration();
    }
    if (state === "play") {
      this.hasEnteredPlayState = true;
      this.tryEmitLogin();
    }
  }

  private tryEmitLogin(): void {
    if (this.loginEmitted || !this.hasEnteredPlayState || !this.hasSeenJoinPacket) {
      return;
    }

    this.loginEmitted = true;
    this.loggedIn = true;
    Logger.info("LoginManager", "Bot oyuna giriş yaptı.");
    this.bus.emit("login");
  }

  private sendClientInformation(): void {
    try {
      this.protocol.write("settings", {
        locale: "tr_TR",
        viewDistance: this.options.viewDistance,
        chatFlags: 0,
        chatColors: true,
        skinParts: 0x7f,
        mainHand: 1,
        enableTextFiltering: false,
        enableServerListing: true,
      });
    } catch (err) {
      Logger.debug("LoginManager", "client_information gönderilemedi (versiyon farkı olabilir):", err);
    }
  }

  finishConfiguration(): void {
    try {
      this.protocol.write("finish_configuration", {});
    } catch (err) {
      Logger.debug("LoginManager", "finish_configuration gönderilemedi:", err);
    }
  }

  private handleJoinGame(data: any): void {
    this.hasSeenJoinPacket = true;
    this.playerEntityId = data.entityId;
    this.gamemode = data.gameMode ?? data.gamemode ?? 0;
    this.dimension = data.dimension ?? data.worldName ?? null;
    Logger.info("LoginManager", `Oyuna katıldı. entityId=${this.playerEntityId}, gamemode=${this.gamemode}`);

    this.sendClientInformation();
    this.tryEmitLogin();
  }

  private handleRespawnGamemode(data: any): void {
    if (data.gamemode !== undefined) this.gamemode = data.gamemode;
    if (data.dimension !== undefined) this.dimension = data.dimension;
  }
}
