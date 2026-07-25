import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { ChatMessage } from "../utils/types";
import { Logger } from "../utils/Logger";

/**
 * Sunucudan gelen tüm sohbet paketi varyantlarını (eski 'chat', yeni
 * 'system_chat', imzalı 'player_chat') tek bir normalize edilmiş
 * ChatMessage haline getirip 'chat' event'i olarak yayınlar. Ayrıca
 * bot.chat() ile giden mesajları gönderir.
 */
export class ChatManager {
  constructor(private readonly bus: EventBus, private readonly protocol: ProtocolManager) {
    this.bus.on("packet:chat", (data: any) => this.handleLegacyChat(data));
    this.bus.on("packet:system_chat", (data: any) => this.handleSystemChat(data));
    this.bus.on("packet:player_chat", (data: any) => this.handlePlayerChat(data));
  }

  private handleLegacyChat(data: any): void {
    const json = this.safeParseJson(data.message);
    const message: ChatMessage = {
      text: this.flattenComponent(json),
      json,
    };
    Logger.debug("ChatManager", `chat: ${message.text}`);
    this.bus.emit("chat", message);
    this.bus.emit("message", message);
  }

  private handleSystemChat(data: any): void {
    const json = this.safeParseJson(data.content);
    const message: ChatMessage = {
      text: this.flattenComponent(json),
      json,
    };
    Logger.debug("ChatManager", `system_chat: ${message.text}`);
    this.bus.emit("chat", message);
    this.bus.emit("message", message);
  }

  private handlePlayerChat(data: any): void {
    const plainText: string = data.plainMessage ?? data.unsignedContent ?? "";
    const sender: string | undefined = data.senderName ?? data.networkName?.text ?? undefined;
    const message: ChatMessage = {
      text: plainText,
      json: data.unsignedContent ?? null,
      sender,
    };
    Logger.debug("ChatManager", `player_chat [${sender ?? "?"}]: ${message.text}`);
    this.bus.emit("chat", message);
    this.bus.emit("playerChat", message);
    this.bus.emit("message", message);
  }

  private safeParseJson(raw: unknown): any {
    if (raw === null || raw === undefined) return null;
    if (typeof raw === "object") return raw;
    try {
      return JSON.parse(String(raw));
    } catch {
      return { text: String(raw) };
    }
  }

  /** Minecraft chat component ağacını düz metne indirger (extra dizisi dahil). */
  private flattenComponent(component: any): string {
    if (component === null || component === undefined) return "";
    if (typeof component === "string") return component;

    let result = "";
    if (typeof component.text === "string") result += component.text;
    if (typeof component.translate === "string") result += component.translate;

    if (Array.isArray(component.extra)) {
      for (const child of component.extra) {
        result += this.flattenComponent(child);
      }
    }
    return result;
  }

  send(message: string): void {
    if (message.length === 0) return;
    this.protocol.write("chat_message", {
      message,
      timestamp: BigInt(Date.now()),
      salt: BigInt(0),
      signature: undefined,
      offset: 0,
      acknowledged: Buffer.alloc(3),
    });
  }

  sendCommand(command: string): void {
    const clean = command.startsWith("/") ? command.slice(1) : command;
    this.protocol.write("chat_command", {
      command: clean,
      timestamp: BigInt(Date.now()),
      salt: BigInt(0),
      argumentSignatures: [],
      messageCount: 0,
      acknowledged: Buffer.alloc(3),
    });
  }
}
