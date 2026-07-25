import { Vec3 } from "vec3";
import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { TeleportManager } from "./TeleportManager";
import { BlockManager } from "./BlockManager";
import { ControlName, ControlStates } from "../utils/types";
import { lookAtYawPitch, normalizeYaw, clampPitch } from "../utils/Vec3Utils";
import { Logger } from "../utils/Logger";

/**
 * Hareket, bakış ve etkileşim eylemlerinin tamamını tek bir yerden
 * yönetir. bot.move()/look()/dig()/placeBlock() gibi tüm API
 * metotları buraya delege edilir; kullanıcı hiçbir zaman ham paket
 * yazmak zorunda kalmaz.
 */
export class MovementManager {
  public controlState: ControlStates = {
    forward: false,
    back: false,
    left: false,
    right: false,
    jump: false,
    sneak: false,
    sprint: false,
  };

  private diggingTarget: Vec3 | null = null;

  constructor(
    private readonly bus: EventBus,
    private readonly protocol: ProtocolManager,
    private readonly teleport: TeleportManager,
    private readonly blocks: BlockManager
  ) {}

  look(yaw: number, pitch: number, force = false): void {
    this.teleport.yaw = normalizeYaw(yaw);
    this.teleport.pitch = clampPitch(pitch);
    // "look" (serverbound Move Player Rot) paketinin onGround alanı da
    // "position" ile aynı 1.21.2 bitfield değişikliğine tabi; writeMovement
    // doğru şemayı çalışma zamanında çözer (bkz. ProtocolManager).
    this.protocol.writeMovement(
      "look",
      "packet_look",
      { yaw: this.teleport.yaw, pitch: this.teleport.pitch },
      { onGround: this.teleport.onGround, horizontalCollision: false }
    );
    if (force) this.bus.emit("look", { yaw: this.teleport.yaw, pitch: this.teleport.pitch });
  }

  lookAt(point: Vec3): void {
    const { yaw, pitch } = lookAtYawPitch(this.teleport.position.offset(0, 1.62, 0), point);
    this.look(yaw, pitch);
  }

  swingArm(hand: "right" | "left" = "right"): void {
    this.protocol.write("arm_animation", { hand: hand === "right" ? 0 : 1 });
  }

  attack(entityId: number): void {
    this.swingArm();
    this.protocol.write("use_entity", {
      target: entityId,
      mouse: 1, // attack
      sneaking: this.controlState.sneak,
    });
  }

  useItem(hand: "right" | "left" = "right"): void {
    this.protocol.write("use_item", { hand: hand === "right" ? 0 : 1, sequence: 0 });
  }

  interactEntity(entityId: number, hand: "right" | "left" = "right"): void {
    this.protocol.write("use_entity", {
      target: entityId,
      mouse: 0, // interact
      hand: hand === "right" ? 0 : 1,
      sneaking: this.controlState.sneak,
    });
  }

  placeBlock(referencePosition: Vec3, face: Vec3): void {
    this.blocks.placeBlock(referencePosition, face);
    this.swingArm();
  }

  dig(position: Vec3, face: Vec3 = new Vec3(0, 1, 0)): void {
    if (this.diggingTarget) return;
    this.diggingTarget = position;
    this.blocks.digStart(position, face);
    this.bus.emit("digStart", position);

    // Basit tahmini kazma süresi (araç/blok sertliği hesaplanmaz,
    // sabit gecikme kullanılır — gerçek zamanlama hedef blok/alet
    // veriye bağlı olduğundan tam hesap kapsam dışıdır).
    const estimatedMs = 250;
    setTimeout(() => {
      if (!this.diggingTarget) return;
      this.blocks.digFinish(position, face);
      this.diggingTarget = null;
      this.bus.emit("digEnd", position);
    }, estimatedMs);
  }

  cancelDig(): void {
    if (!this.diggingTarget) return;
    this.blocks.digCancel(this.diggingTarget);
    this.diggingTarget = null;
  }

  private playerEntityId = -1;

  setPlayerEntityId(id: number): void {
    this.playerEntityId = id;
  }

  /**
   * forward/back/left/right/jump gibi yön kontrolleri sadece yerel
   * controlState'i günceller; gerçek hareket paketleri (position)
   * PhysicsManager'ın tick döngüsünde gönderilir. sneak/sprint ise
   * Minecraft protokolünde ayrıca bir entity_action paketi gerektirir.
   */
  setControlState(control: ControlName, state: boolean): void {
    this.controlState[control] = state;

    if (control === "sneak" || control === "sprint") {
      this.protocol.write("entity_action", {
        entityId: this.playerEntityId,
        actionId: this.actionIdFor(control, state),
        jumpBoost: 0,
      });
    }

    this.bus.emit("controlStateChanged", { control, state });
  }

  private actionIdFor(control: "sneak" | "sprint", state: boolean): number {
    if (control === "sneak") return state ? 0 : 1;
    return state ? 3 : 4; // sprint start/stop
  }

  jump(): void {
    this.controlState.jump = true;
    this.bus.emit("controlStateChanged", { control: "jump", state: true });
  }

  sneak(state = true): void {
    this.setControlState("sneak", state);
  }

  sprint(state = true): void {
    this.setControlState("sprint", state);
  }

  move(direction: ControlName, state = true): void {
    if (direction === "jump") {
      if (state) this.jump();
      else this.controlState.jump = false;
      return;
    }
    this.controlState[direction] = state;
    this.bus.emit("controlStateChanged", { control: direction, state });
  }

  stop(): void {
    (Object.keys(this.controlState) as ControlName[]).forEach((key) => {
      this.controlState[key] = false;
    });
    this.bus.emit("stopped");
  }
}
