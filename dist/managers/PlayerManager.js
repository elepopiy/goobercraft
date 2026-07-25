"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerManager = void 0;
/**
 * player_info paketleri (tab listesi) üzerinden sunucudaki tüm
 * oyuncuların uuid/username/ping/gamemode bilgisini tutar. Entity ile
 * (görünür model) UUID üzerinden eşleşme kurar.
 */
class PlayerManager {
    bus;
    entities;
    players = new Map();
    constructor(bus, entities) {
        this.bus = bus;
        this.entities = entities;
        this.bus.on("packet:player_info", (data) => this.handlePlayerInfo(data));
        this.bus.on("packet:player_remove", (data) => this.handlePlayerRemove(data));
        this.bus.on("playerEntitySpawn", (entity) => this.linkEntity(entity));
    }
    handlePlayerInfo(data) {
        const action = data.action;
        const entries = data.data ?? [];
        for (const entry of entries) {
            const uuid = entry.UUID ?? entry.uuid;
            if (!uuid)
                continue;
            let player = this.players.get(uuid);
            if (!player) {
                player = { uuid, username: entry.name ?? entry.player?.name ?? "unknown", ping: 0, gamemode: 0 };
                this.players.set(uuid, player);
            }
            if (entry.name)
                player.username = entry.name;
            if (entry.player?.name)
                player.username = entry.player.name;
            if (entry.ping !== undefined)
                player.ping = entry.ping;
            if (entry.gamemode !== undefined)
                player.gamemode = entry.gamemode;
            if (entry.displayName)
                player.displayName = this.flatten(entry.displayName);
            // action bitmask (1.19.3+) veya legacy sayısal action tipi
            if (typeof action === "number" && action === 4) {
                this.players.delete(uuid);
                this.bus.emit("playerLeft", player);
                continue;
            }
        }
        this.bus.emit("playerListUpdated", this.all());
    }
    handlePlayerRemove(data) {
        const uuids = data.players ?? [];
        for (const uuid of uuids) {
            const player = this.players.get(uuid);
            if (player) {
                this.players.delete(uuid);
                this.bus.emit("playerLeft", player);
            }
        }
    }
    linkEntity(entity) {
        const player = this.players.get(entity.uuid);
        if (player) {
            player.entity = entity;
        }
    }
    flatten(component) {
        if (!component)
            return "";
        if (typeof component === "string")
            return component;
        let text = component.text ?? "";
        if (Array.isArray(component.extra)) {
            for (const child of component.extra)
                text += this.flatten(child);
        }
        return text;
    }
    get(uuid) {
        return this.players.get(uuid);
    }
    byUsername(username) {
        for (const player of this.players.values()) {
            if (player.username === username)
                return player;
        }
        return undefined;
    }
    all() {
        return Array.from(this.players.values());
    }
    clear() {
        this.players.clear();
    }
}
exports.PlayerManager = PlayerManager;
//# sourceMappingURL=PlayerManager.js.map