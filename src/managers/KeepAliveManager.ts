import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { Logger } from "../utils/Logger";

/**
 * Sunucudan gelen her keep_alive paketine, kullanıcı hiçbir şey
 * yapmadan otomatik olarak aynı id ile cevap verir. Bu olmazsa
 * sunucu botu birkaç saniye içinde zaman aşımına uğratıp atar.
 */
export class KeepAliveManager {
  private lastKeepAliveAt = 0;
  private missed = 0;

  constructor(private readonly bus: EventBus, private readonly protocol: ProtocolManager) {
    this.bus.on("packet:keep_alive", (data: any) => this.handleKeepAlive(data));
  }

  private handleKeepAlive(data: any): void {
    const id = data.keepAliveId;
    this.lastKeepAliveAt = Date.now();
    this.missed = 0;
    this.protocol.write("keep_alive", { keepAliveId: id });
    Logger.debug("KeepAliveManager", `keep_alive yanıtlandı: ${id?.toString?.() ?? id}`);
  }

  getLastKeepAliveAt(): number {
    return this.lastKeepAliveAt;
  }
}
