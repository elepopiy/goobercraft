import { EventBus } from "../core/EventBus";
import { EntityManager } from "./EntityManager";
import { PlayerData } from "../utils/types";
import { Logger } from "../utils/Logger";

/**
 * player_info paketleri (tab listesi) üzerinden sunucudaki tüm
 * oyuncuların uuid/username/ping/gamemode bilgisini tutar. Entity ile
 * (görünür model) UUID üzerinden eşleşme kurar.
 */
export class PlayerManager {
  private players: Map<string, PlayerData> = new Map();

  constructor(private readonly bus: EventBus, private readonly entities: EntityManager) {
    this.bus.on("packet:player_info", (data: any) => this.handlePlayerInfo(data));
    this.bus.on("packet:player_remove", (data: any) => this.handlePlayerRemove(data));
    this.bus.on("playerEntitySpawn", (entity: any) => this.linkEntity(entity));
  }

  private handlePlayerInfo(data: any): void {
    const action = data.action;
    const entries = data.data ?? [];

    for (const entry of entries) {
      const uuid: string = entry.UUID ?? entry.uuid;
      if (!uuid) continue;

      let player = this.players.get(uuid);
      if (!player) {
        player = { uuid, username: entry.name ?? entry.player?.name ?? "unknown", ping: 0, gamemode: 0 };
        this.players.set(uuid, player);
      }

      if (entry.name) player.username = entry.name;
      if (entry.player?.name) player.username = entry.player.name;
      if (entry.ping !== undefined) player.ping = entry.ping;
      if (entry.gamemode !== undefined) player.gamemode = entry.gamemode;
      if (entry.displayName) player.displayName = this.flatten(entry.displayName);

      // action bitmask (1.19.3+) veya legacy sayısal action tipi
      if (typeof action === "number" && action === 4) {
        this.players.delete(uuid);
        this.bus.emit("playerLeft", player);
        continue;
      }
    }

    this.bus.emit("playerListUpdated", this.all());
  }

  private handlePlayerRemove(data: any): void {
    const uuids: string[] = data.players ?? [];
    for (const uuid of uuids) {
      const player = this.players.get(uuid);
      if (player) {
        this.players.delete(uuid);
        this.bus.emit("playerLeft", player);
      }
    }
  }

  private linkEntity(entity: any): void {
    const player = this.players.get(entity.uuid);
    if (player) {
      player.entity = entity;
    }
  }

  private flatten(component: any): string {
    if (!component) return "";
    if (typeof component === "string") return component;
    let text = component.text ?? "";
    if (Array.isArray(component.extra)) {
      for (const child of component.extra) text += this.flatten(child);
    }
    return text;
  }

  get(uuid: string): PlayerData | undefined {
    return this.players.get(uuid);
  }

  byUsername(username: string): PlayerData | undefined {
    for (const player of this.players.values()) {
      if (player.username === username) return player;
    }
    return undefined;
  }

  all(): PlayerData[] {
    return Array.from(this.players.values());
  }

  clear(): void {
    this.players.clear();
  }
}
