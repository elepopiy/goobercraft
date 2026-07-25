"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleportManager = void 0;
const vec3_1 = require("vec3");
const Logger_1 = require("../utils/Logger");
/**
 * Sunucu, botun pozisyonunu zorla değiştirmek istediğinde bir
 * "position" (Synchronize Player Position) paketi gönderir ve bir
 * teleportId bekler. Bu manager söz konusu paketi yakalar, botun
 * konumunu günceller ve teleport_confirm paketini otomatik gönderir.
 * Kullanıcının bunu elle yapmasına asla gerek yoktur.
 */
class TeleportManager {
    bus;
    protocol;
    position = new vec3_1.Vec3(0, 0, 0);
    yaw = 0;
    pitch = 0;
    onGround = true;
    constructor(bus, protocol) {
        this.bus = bus;
        this.protocol = protocol;
        this.bus.on("packet:position", (data) => this.handlePosition(data));
    }
    handlePosition(data) {
        const flags = data.flags ?? 0;
        const relX = (flags & 0x01) !== 0;
        const relY = (flags & 0x02) !== 0;
        const relZ = (flags & 0x04) !== 0;
        const relYaw = (flags & 0x08) !== 0;
        const relPitch = (flags & 0x10) !== 0;
        this.position = new vec3_1.Vec3(relX ? this.position.x + data.x : data.x, relY ? this.position.y + data.y : data.y, relZ ? this.position.z + data.z : data.z);
        this.yaw = relYaw ? this.yaw + data.yaw : data.yaw;
        this.pitch = relPitch ? this.pitch + data.pitch : data.pitch;
        if (data.teleportId !== undefined) {
            this.protocol.write("teleport_confirm", { teleportId: data.teleportId });
            Logger_1.Logger.debug("TeleportManager", `teleport_confirm gönderildi: ${data.teleportId}`);
        }
        this.bus.emit("teleported", { position: this.position, yaw: this.yaw, pitch: this.pitch });
    }
}
exports.TeleportManager = TeleportManager;
//# sourceMappingURL=TeleportManager.js.map