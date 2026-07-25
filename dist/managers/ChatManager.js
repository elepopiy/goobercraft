"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatManager = void 0;
const Logger_1 = require("../utils/Logger");
/**
 * Sunucudan gelen tüm sohbet paketi varyantlarını (eski 'chat', yeni
 * 'system_chat', imzalı 'player_chat') tek bir normalize edilmiş
 * ChatMessage haline getirip 'chat' event'i olarak yayınlar. Ayrıca
 * bot.chat() ile giden mesajları gönderir.
 */
class ChatManager {
    bus;
    protocol;
    constructor(bus, protocol) {
        this.bus = bus;
        this.protocol = protocol;
        this.bus.on("packet:chat", (data) => this.handleLegacyChat(data));
        this.bus.on("packet:system_chat", (data) => this.handleSystemChat(data));
        this.bus.on("packet:player_chat", (data) => this.handlePlayerChat(data));
    }
    handleLegacyChat(data) {
        const json = this.safeParseJson(data.message);
        const message = {
            text: this.flattenComponent(json),
            json,
        };
        Logger_1.Logger.debug("ChatManager", `chat: ${message.text}`);
        this.bus.emit("chat", message);
        this.bus.emit("message", message);
    }
    handleSystemChat(data) {
        const json = this.safeParseJson(data.content);
        const message = {
            text: this.flattenComponent(json),
            json,
        };
        Logger_1.Logger.debug("ChatManager", `system_chat: ${message.text}`);
        this.bus.emit("chat", message);
        this.bus.emit("message", message);
    }
    handlePlayerChat(data) {
        const plainText = data.plainMessage ?? data.unsignedContent ?? "";
        const sender = data.senderName ?? data.networkName?.text ?? undefined;
        const message = {
            text: plainText,
            json: data.unsignedContent ?? null,
            sender,
        };
        Logger_1.Logger.debug("ChatManager", `player_chat [${sender ?? "?"}]: ${message.text}`);
        this.bus.emit("chat", message);
        this.bus.emit("playerChat", message);
        this.bus.emit("message", message);
    }
    safeParseJson(raw) {
        if (raw === null || raw === undefined)
            return null;
        if (typeof raw === "object")
            return raw;
        try {
            return JSON.parse(String(raw));
        }
        catch {
            return { text: String(raw) };
        }
    }
    /** Minecraft chat component ağacını düz metne indirger (extra dizisi dahil). */
    flattenComponent(component) {
        if (component === null || component === undefined)
            return "";
        if (typeof component === "string")
            return component;
        let result = "";
        if (typeof component.text === "string")
            result += component.text;
        if (typeof component.translate === "string")
            result += component.translate;
        if (Array.isArray(component.extra)) {
            for (const child of component.extra) {
                result += this.flattenComponent(child);
            }
        }
        return result;
    }
    send(message) {
        if (message.length === 0)
            return;
        this.protocol.write("chat_message", {
            message,
            timestamp: BigInt(Date.now()),
            salt: BigInt(0),
            signature: undefined,
            offset: 0,
            acknowledged: Buffer.alloc(3),
        });
    }
    sendCommand(command) {
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
exports.ChatManager = ChatManager;
//# sourceMappingURL=ChatManager.js.map