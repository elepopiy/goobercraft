"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginManager = void 0;
const Logger_1 = require("../utils/Logger");
/**
 * minecraft-protocol; handshake, encryption ve compression'ı zaten
 * kendi içinde otomatik yürütür. LoginManager'ın sorumluluğu, login
 * tamamlandıktan sonraki "configuration" state'inde (1.20.2+) sunucunun
 * beklediği client_information ve finish_configuration paketlerini
 * otomatik göndermek, ve login/join_game paketini yakalayıp bot'un
 * temel oyun durumunu (entityId, dünya adı, gamemode vb.) doldurmaktır.
 */
class LoginManager {
    bus;
    protocol;
    options;
    playerEntityId = null;
    gamemode = 0;
    dimension = null;
    loggedIn = false;
    hasEnteredPlayState = false;
    loginEmitted = false;
    constructor(bus, protocol, options) {
        this.bus = bus;
        this.protocol = protocol;
        this.options = options;
        this.bus.on("_raw_state", (state) => this.handleStateChange(state));
        this.bus.on("_raw_playerJoin", () => this.tryEmitLogin());
        this.bus.on("packet:login", (data) => this.handleJoinGame(data));
        this.bus.on("packet:respawn", (data) => this.handleRespawnGamemode(data));
        this.bus.on("packet:server_data", () => {
            /* sunucu meta verisi - şimdilik sadece gözlemleniyor */
        });
    }
    handleStateChange(state) {
        Logger_1.Logger.info("LoginManager", `protokol durumu değişti: ${state}`);
        if (state === "configuration") {
            this.sendClientInformation();
        }
        if (state === "play") {
            this.hasEnteredPlayState = true;
            this.tryEmitLogin();
        }
    }
    tryEmitLogin() {
        if (this.loginEmitted || !this.hasEnteredPlayState) {
            return;
        }
        this.loginEmitted = true;
        this.loggedIn = true;
        this.bus.emit("login");
    }
    sendClientInformation() {
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
        }
        catch (err) {
            Logger_1.Logger.debug("LoginManager", "client_information gönderilemedi (versiyon farkı olabilir):", err);
        }
    }
    finishConfiguration() {
        try {
            this.protocol.write("finish_configuration", {});
        }
        catch (err) {
            Logger_1.Logger.debug("LoginManager", "finish_configuration gönderilemedi:", err);
        }
    }
    handleJoinGame(data) {
        this.playerEntityId = data.entityId;
        this.gamemode = data.gameMode ?? data.gamemode ?? 0;
        this.dimension = data.dimension ?? data.worldName ?? null;
        Logger_1.Logger.info("LoginManager", `Oyuna katıldı. entityId=${this.playerEntityId}, gamemode=${this.gamemode}`);
        this.sendClientInformation();
        this.tryEmitLogin();
    }
    handleRespawnGamemode(data) {
        if (data.gamemode !== undefined)
            this.gamemode = data.gamemode;
        if (data.dimension !== undefined)
            this.dimension = data.dimension;
    }
}
exports.LoginManager = LoginManager;
//# sourceMappingURL=LoginManager.js.map