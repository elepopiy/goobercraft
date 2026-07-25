"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementManager = void 0;
const vec3_1 = require("vec3");
const Vec3Utils_1 = require("../utils/Vec3Utils");
/**
 * Hareket, bakış ve etkileşim eylemlerinin tamamını tek bir yerden
 * yönetir. bot.move()/look()/dig()/placeBlock() gibi tüm API
 * metotları buraya delege edilir; kullanıcı hiçbir zaman ham paket
 * yazmak zorunda kalmaz.
 */
class MovementManager {
    bus;
    protocol;
    teleport;
    blocks;
    controlState = {
        forward: false,
        back: false,
        left: false,
        right: false,
        jump: false,
        sneak: false,
        sprint: false,
    };
    diggingTarget = null;
    constructor(bus, protocol, teleport, blocks) {
        this.bus = bus;
        this.protocol = protocol;
        this.teleport = teleport;
        this.blocks = blocks;
    }
    look(yaw, pitch, force = false) {
        this.teleport.yaw = (0, Vec3Utils_1.normalizeYaw)(yaw);
        this.teleport.pitch = (0, Vec3Utils_1.clampPitch)(pitch);
        // "look" (serverbound Move Player Rot) paketinin onGround alanı da
        // "position" ile aynı 1.21.2 bitfield değişikliğine tabi; writeMovement
        // doğru şemayı çalışma zamanında çözer (bkz. ProtocolManager).
        this.protocol.writeMovement("look", "packet_look", { yaw: this.teleport.yaw, pitch: this.teleport.pitch }, { onGround: this.teleport.onGround, horizontalCollision: false });
        if (force)
            this.bus.emit("look", { yaw: this.teleport.yaw, pitch: this.teleport.pitch });
    }
    lookAt(point) {
        const { yaw, pitch } = (0, Vec3Utils_1.lookAtYawPitch)(this.teleport.position.offset(0, 1.62, 0), point);
        this.look(yaw, pitch);
    }
    swingArm(hand = "right") {
        this.protocol.write("arm_animation", { hand: hand === "right" ? 0 : 1 });
    }
    attack(entityId) {
        this.swingArm();
        this.protocol.write("use_entity", {
            target: entityId,
            mouse: 1, // attack
            sneaking: this.controlState.sneak,
        });
    }
    useItem(hand = "right") {
        this.protocol.write("use_item", { hand: hand === "right" ? 0 : 1, sequence: 0 });
    }
    interactEntity(entityId, hand = "right") {
        this.protocol.write("use_entity", {
            target: entityId,
            mouse: 0, // interact
            hand: hand === "right" ? 0 : 1,
            sneaking: this.controlState.sneak,
        });
    }
    placeBlock(referencePosition, face) {
        this.blocks.placeBlock(referencePosition, face);
        this.swingArm();
    }
    dig(position, face = new vec3_1.Vec3(0, 1, 0)) {
        if (this.diggingTarget)
            return;
        this.diggingTarget = position;
        this.blocks.digStart(position, face);
        this.bus.emit("digStart", position);
        // Basit tahmini kazma süresi (araç/blok sertliği hesaplanmaz,
        // sabit gecikme kullanılır — gerçek zamanlama hedef blok/alet
        // veriye bağlı olduğundan tam hesap kapsam dışıdır).
        const estimatedMs = 250;
        setTimeout(() => {
            if (!this.diggingTarget)
                return;
            this.blocks.digFinish(position, face);
            this.diggingTarget = null;
            this.bus.emit("digEnd", position);
        }, estimatedMs);
    }
    cancelDig() {
        if (!this.diggingTarget)
            return;
        this.blocks.digCancel(this.diggingTarget);
        this.diggingTarget = null;
    }
    playerEntityId = -1;
    setPlayerEntityId(id) {
        this.playerEntityId = id;
    }
    /**
     * forward/back/left/right/jump gibi yön kontrolleri sadece yerel
     * controlState'i günceller; gerçek hareket paketleri (position)
     * PhysicsManager'ın tick döngüsünde gönderilir. sneak/sprint ise
     * Minecraft protokolünde ayrıca bir entity_action paketi gerektirir.
     */
    setControlState(control, state) {
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
    actionIdFor(control, state) {
        if (control === "sneak")
            return state ? 0 : 1;
        return state ? 3 : 4; // sprint start/stop
    }
    jump() {
        this.controlState.jump = true;
        this.bus.emit("controlStateChanged", { control: "jump", state: true });
    }
    sneak(state = true) {
        this.setControlState("sneak", state);
    }
    sprint(state = true) {
        this.setControlState("sprint", state);
    }
    move(direction, state = true) {
        if (direction === "jump") {
            if (state)
                this.jump();
            else
                this.controlState.jump = false;
            return;
        }
        this.controlState[direction] = state;
        this.bus.emit("controlStateChanged", { control: direction, state });
    }
    stop() {
        Object.keys(this.controlState).forEach((key) => {
            this.controlState[key] = false;
        });
        this.bus.emit("stopped");
    }
}
exports.MovementManager = MovementManager;
//# sourceMappingURL=MovementManager.js.map