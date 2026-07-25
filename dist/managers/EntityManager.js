"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
const vec3_1 = require("vec3");
const Entity_1 = require("../entity/Entity");
const Vec3Utils_1 = require("../utils/Vec3Utils");
/**
 * Sunucudaki tüm entity'lerin (mob, item, projectile, araç, oyuncu)
 * yaşam döngüsünü Map<number, Entity> üzerinde takip eder. Map
 * kullanımı, binlerce entity olsa dahi ekleme/silme/arama işlemlerinin
 * O(1) karmaşıklıkta kalmasını sağlar (performans hedefi).
 */
class EntityManager {
    bus;
    entities = new Map();
    constructor(bus) {
        this.bus = bus;
        this.bus.on("packet:spawn_entity", (data) => this.handleSpawnEntity(data));
        this.bus.on("packet:named_entity_spawn", (data) => this.handleSpawnPlayerEntity(data));
        this.bus.on("packet:entity_destroy", (data) => this.handleDestroy(data));
        this.bus.on("packet:rel_entity_move", (data) => this.handleRelMove(data));
        this.bus.on("packet:entity_move_look", (data) => this.handleRelMove(data));
        this.bus.on("packet:entity_look", (data) => this.handleLook(data));
        this.bus.on("packet:entity_teleport", (data) => this.handleTeleport(data));
        this.bus.on("packet:entity_velocity", (data) => this.handleVelocity(data));
        this.bus.on("packet:entity_head_rotation", (data) => this.handleHeadRotation(data));
        this.bus.on("packet:entity_metadata", (data) => this.handleMetadata(data));
        this.bus.on("packet:entity_status", (data) => this.bus.emit("entityStatus", data));
    }
    handleSpawnEntity(data) {
        const position = new vec3_1.Vec3(data.x, data.y, data.z);
        const entity = new Entity_1.Entity(data.entityId, data.type ?? data.objectData ?? -1, position);
        entity.uuid = data.objectUUID ?? data.uuid;
        entity.yaw = (data.yaw ?? 0) * (360 / 256);
        entity.pitch = (data.pitch ?? 0) * (360 / 256);
        entity.velocity = new vec3_1.Vec3((data.velocityX ?? 0) / 8000, (data.velocityY ?? 0) / 8000, (data.velocityZ ?? 0) / 8000);
        this.entities.set(entity.id, entity);
        this.bus.emit("entitySpawn", entity);
    }
    handleSpawnPlayerEntity(data) {
        const position = new vec3_1.Vec3(data.x, data.y, data.z);
        const entity = new Entity_1.Entity(data.entityId, -1, position);
        entity.uuid = data.playerUUID;
        entity.isPlayer = true;
        entity.yaw = (data.yaw ?? 0) * (360 / 256);
        entity.pitch = (data.pitch ?? 0) * (360 / 256);
        this.entities.set(entity.id, entity);
        this.bus.emit("entitySpawn", entity);
        this.bus.emit("playerEntitySpawn", entity);
    }
    handleDestroy(data) {
        const ids = data.entityIds ?? (data.entityId !== undefined ? [data.entityId] : []);
        for (const id of ids) {
            const entity = this.entities.get(id);
            if (entity) {
                this.entities.delete(id);
                this.bus.emit("entityGone", entity);
            }
        }
    }
    handleRelMove(data) {
        const entity = this.entities.get(data.entityId);
        if (!entity)
            return;
        if (data.dX !== undefined) {
            entity.position = entity.position.offset(data.dX / 4096, data.dY / 4096, data.dZ / 4096);
        }
        if (data.yaw !== undefined)
            entity.yaw = data.yaw * (360 / 256);
        if (data.pitch !== undefined)
            entity.pitch = data.pitch * (360 / 256);
        if (data.onGround !== undefined)
            entity.onGround = data.onGround;
        this.bus.emit("entityMoved", entity);
    }
    handleLook(data) {
        const entity = this.entities.get(data.entityId);
        if (!entity)
            return;
        entity.yaw = data.yaw * (360 / 256);
        entity.pitch = data.pitch * (360 / 256);
        this.bus.emit("entityMoved", entity);
    }
    handleTeleport(data) {
        const entity = this.entities.get(data.entityId);
        if (!entity)
            return;
        entity.position = new vec3_1.Vec3(data.x, data.y, data.z);
        entity.yaw = data.yaw * (360 / 256);
        entity.pitch = data.pitch * (360 / 256);
        entity.onGround = data.onGround ?? entity.onGround;
        this.bus.emit("entityMoved", entity);
    }
    handleVelocity(data) {
        const entity = this.entities.get(data.entityId);
        if (!entity)
            return;
        entity.velocity = new vec3_1.Vec3(data.velocityX / 8000, data.velocityY / 8000, data.velocityZ / 8000);
    }
    handleHeadRotation(data) {
        const entity = this.entities.get(data.entityId);
        if (!entity)
            return;
        entity.headYaw = data.headYaw * (360 / 256);
    }
    handleMetadata(data) {
        const entity = this.entities.get(data.entityId);
        if (!entity)
            return;
        for (const item of data.metadata ?? []) {
            entity.metadata[item.key] = item.value;
        }
        this.bus.emit("entityUpdated", entity);
    }
    register(entity) {
        this.entities.set(entity.id, entity);
    }
    get(id) {
        return this.entities.get(id);
    }
    remove(id) {
        const entity = this.entities.get(id);
        if (entity) {
            this.entities.delete(id);
            this.bus.emit("entityGone", entity);
        }
    }
    all() {
        return Array.from(this.entities.values());
    }
    get size() {
        return this.entities.size;
    }
    nearest(from, predicate = () => true) {
        let closest = null;
        let closestDistSq = Infinity;
        for (const entity of this.entities.values()) {
            if (!predicate(entity))
                continue;
            const distSq = (0, Vec3Utils_1.distanceSquared)(from, entity.position);
            if (distSq < closestDistSq) {
                closestDistSq = distSq;
                closest = entity;
            }
        }
        return closest;
    }
    clear() {
        this.entities.clear();
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=EntityManager.js.map