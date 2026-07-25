import { Vec3 } from "vec3";
import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { TeleportManager } from "./TeleportManager";
import { BlockManager } from "./BlockManager";
import { ControlName, ControlStates } from "../utils/types";
/**
 * Hareket, bakış ve etkileşim eylemlerinin tamamını tek bir yerden
 * yönetir. bot.move()/look()/dig()/placeBlock() gibi tüm API
 * metotları buraya delege edilir; kullanıcı hiçbir zaman ham paket
 * yazmak zorunda kalmaz.
 */
export declare class MovementManager {
    private readonly bus;
    private readonly protocol;
    private readonly teleport;
    private readonly blocks;
    controlState: ControlStates;
    private diggingTarget;
    constructor(bus: EventBus, protocol: ProtocolManager, teleport: TeleportManager, blocks: BlockManager);
    look(yaw: number, pitch: number, force?: boolean): void;
    lookAt(point: Vec3): void;
    swingArm(hand?: "right" | "left"): void;
    attack(entityId: number): void;
    useItem(hand?: "right" | "left"): void;
    interactEntity(entityId: number, hand?: "right" | "left"): void;
    placeBlock(referencePosition: Vec3, face: Vec3): void;
    dig(position: Vec3, face?: Vec3): void;
    cancelDig(): void;
    private playerEntityId;
    setPlayerEntityId(id: number): void;
    /**
     * forward/back/left/right/jump gibi yön kontrolleri sadece yerel
     * controlState'i günceller; gerçek hareket paketleri (position)
     * PhysicsManager'ın tick döngüsünde gönderilir. sneak/sprint ise
     * Minecraft protokolünde ayrıca bir entity_action paketi gerektirir.
     */
    setControlState(control: ControlName, state: boolean): void;
    private actionIdFor;
    jump(): void;
    sneak(state?: boolean): void;
    sprint(state?: boolean): void;
    move(direction: ControlName, state?: boolean): void;
    stop(): void;
}
//# sourceMappingURL=MovementManager.d.ts.map