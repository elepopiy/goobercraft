import { Vec3 } from "vec3";
import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
/**
 * Sunucu, botun pozisyonunu zorla değiştirmek istediğinde bir
 * "position" (Synchronize Player Position) paketi gönderir ve bir
 * teleportId bekler. Bu manager söz konusu paketi yakalar, botun
 * konumunu günceller ve teleport_confirm paketini otomatik gönderir.
 * Kullanıcının bunu elle yapmasına asla gerek yoktur.
 */
export declare class TeleportManager {
    private readonly bus;
    private readonly protocol;
    position: Vec3;
    yaw: number;
    pitch: number;
    onGround: boolean;
    constructor(bus: EventBus, protocol: ProtocolManager);
    private handlePosition;
}
//# sourceMappingURL=TeleportManager.d.ts.map