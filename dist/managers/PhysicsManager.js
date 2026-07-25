"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicsManager = void 0;
const vec3_1 = require("vec3");
const Logger_1 = require("../utils/Logger");
const TICK_MS = 50;
const GRAVITY = -0.08;
const DRAG = 0.98;
const WALK_SPEED = 4.317 / 20;
const SPRINT_MULTIPLIER = 1.3;
const JUMP_VELOCITY = 0.42;
const TERMINAL_VELOCITY = -3.92;
class PhysicsManager {
    bus;
    protocol;
    teleport;
    movement;
    world;
    interval = null;
    velocity = new vec3_1.Vec3(0, 0, 0);
    constructor(bus, protocol, teleport, movement, world) {
        this.bus = bus;
        this.protocol = protocol;
        this.teleport = teleport;
        this.movement = movement;
        this.world = world;
    }
    start() {
        if (this.interval)
            return;
        this.interval = setInterval(() => {
            try {
                this.tick();
            }
            catch (err) {
                Logger_1.Logger.error("PhysicsManager", "physics tick error", err);
            }
        }, TICK_MS);
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    tick() {
        const control = this.movement.controlState;
        const pos = this.teleport.position;
        const chunkX = Math.floor(pos.x) >> 4;
        const chunkZ = Math.floor(pos.z) >> 4;
        if (!this.world.getChunk(chunkX, chunkZ)) {
            this.sendPosition(pos, this.teleport.onGround);
            this.bus.emit("physicsTick");
            return;
        }
        const groundBlock = this.world.getBlock(pos.offset(0, -0.001, 0));
        const isOnGround = this.isSolidBlock(groundBlock);
        let dx = 0;
        let dz = 0;
        const yaw = this.teleport.yaw *
            Math.PI / 180;
        const fx = -Math.sin(yaw);
        const fz = Math.cos(yaw);
        const rx = Math.cos(yaw);
        const rz = Math.sin(yaw);
        if (control.forward) {
            dx += fx;
            dz += fz;
        }
        if (control.back) {
            dx -= fx;
            dz -= fz;
        }
        if (control.right) {
            dx += rx;
            dz += rz;
        }
        if (control.left) {
            dx -= rx;
            dz -= rz;
        }
        const len = Math.hypot(dx, dz);
        const speed = WALK_SPEED *
            (control.sprint ? SPRINT_MULTIPLIER : 1) *
            (control.sneak ? 0.3 : 1);
        if (len > 0) {
            dx = (dx / len) * speed;
            dz = (dz / len) * speed;
        }
        if (isOnGround) {
            this.velocity.y = 0;
            if (control.jump) {
                this.velocity.y = JUMP_VELOCITY;
                this.movement.controlState.jump = false;
            }
        }
        else {
            this.velocity.y =
                Math.max((this.velocity.y + GRAVITY) * DRAG, TERMINAL_VELOCITY);
        }
        let nextPos = new vec3_1.Vec3(pos.x + dx, pos.y + this.velocity.y, pos.z + dz);
        if (this.velocity.y < 0) {
            const below = this.world.getBlock(new vec3_1.Vec3(nextPos.x, nextPos.y - 0.001, nextPos.z));
            if (this.isSolidBlock(below)) {
                nextPos =
                    new vec3_1.Vec3(nextPos.x, Math.floor(nextPos.y - 0.001) + 1, nextPos.z);
                this.velocity.y = 0;
            }
        }
        if (this.velocity.y > 0) {
            const above = this.world.getBlock(new vec3_1.Vec3(nextPos.x, nextPos.y + 1.8, nextPos.z));
            if (this.isSolidBlock(above)) {
                nextPos =
                    new vec3_1.Vec3(nextPos.x, Math.floor(nextPos.y + 1.8) - 1.8, nextPos.z);
                this.velocity.y = 0;
            }
        }
        const grounded = this.velocity.y === 0 &&
            isOnGround;
        this.teleport.position =
            nextPos;
        this.teleport.onGround =
            grounded;
        this.sendPosition(nextPos, grounded);
        this.bus.emit("physicsTick");
    }
    sendPosition(pos, onGround) {
        this.protocol.writeMovement("position", "packet_position", {
            x: pos.x,
            y: pos.y,
            z: pos.z
        }, {
            onGround,
            horizontalCollision: false
        });
    }
    isSolidBlock(block) {
        if (!block)
            return false;
        if (typeof block.boundingBox === "string")
            return block.boundingBox === "block";
        if (typeof block.type === "number")
            return block.type !== 0;
        return false;
    }
}
exports.PhysicsManager = PhysicsManager;
//# sourceMappingURL=PhysicsManager.js.map