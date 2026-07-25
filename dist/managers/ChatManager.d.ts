import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
/**
 * Sunucudan gelen tüm sohbet paketi varyantlarını (eski 'chat', yeni
 * 'system_chat', imzalı 'player_chat') tek bir normalize edilmiş
 * ChatMessage haline getirip 'chat' event'i olarak yayınlar. Ayrıca
 * bot.chat() ile giden mesajları gönderir.
 */
export declare class ChatManager {
    private readonly bus;
    private readonly protocol;
    constructor(bus: EventBus, protocol: ProtocolManager);
    private handleLegacyChat;
    private handleSystemChat;
    private handlePlayerChat;
    private safeParseJson;
    /** Minecraft chat component ağacını düz metne indirger (extra dizisi dahil). */
    private flattenComponent;
    send(message: string): void;
    sendCommand(command: string): void;
}
//# sourceMappingURL=ChatManager.d.ts.map