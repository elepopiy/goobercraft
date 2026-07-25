import { Vec3 } from "vec3";
import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { Logger } from "../utils/Logger";

/**
 * Sunucu, botun pozisyonunu zorla değiştirmek istediğinde bir
 * "position" (Synchronize Player Position) paketi gönderir ve bir
 * teleportId bekler. Bu manager söz konusu paketi yakalar, botun
 * konumunu günceller ve teleport_confirm paketini otomatik gönderir.
 * Kullanıcının bunu elle yapmasına asla gerek yoktur.
 */
export class TeleportManager {
  public position: Vec3 = new Vec3(0, 0, 0);
  public yaw = 0;
  public pitch = 0;
  public onGround = true;

  constructor(private readonly bus: EventBus, private readonly protocol: ProtocolManager) {
    this.bus.on("packet:position", (data: any) => this.handlePosition(data));
  }

  private handlePosition(data: any): void {
    const flags = data.flags ?? 0;
    const relX = (flags & 0x01) !== 0;
    const relY = (flags & 0x02) !== 0;
    const relZ = (flags & 0x04) !== 0;
    const relYaw = (flags & 0x08) !== 0;
    const relPitch = (flags & 0x10) !== 0;

    this.position = new Vec3(
      relX ? this.position.x + data.x : data.x,
      relY ? this.position.y + data.y : data.y,
      relZ ? this.position.z + data.z : data.z
    );
    this.yaw = relYaw ? this.yaw + data.yaw : data.yaw;
    this.pitch = relPitch ? this.pitch + data.pitch : data.pitch;

    if (data.teleportId !== undefined) {
      this.protocol.write("teleport_confirm", { teleportId: data.teleportId });
      Logger.debug("TeleportManager", `teleport_confirm gönderildi: ${data.teleportId}`);
    }

    this.bus.emit("teleported", { position: this.position, yaw: this.yaw, pitch: this.pitch });
  }
}
