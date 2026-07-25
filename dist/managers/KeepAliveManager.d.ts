import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
/**
 * Sunucudan gelen her keep_alive paketine, kullanıcı hiçbir şey
 * yapmadan otomatik olarak aynı id ile cevap verir. Bu olmazsa
 * sunucu botu birkaç saniye içinde zaman aşımına uğratıp atar.
 */
export declare class KeepAliveManager {
    private readonly bus;
    private readonly protocol;
    private lastKeepAliveAt;
    private missed;
    constructor(bus: EventBus, protocol: ProtocolManager);
    private handleKeepAlive;
    getLastKeepAliveAt(): number;
}
//# sourceMappingURL=KeepAliveManager.d.ts.map