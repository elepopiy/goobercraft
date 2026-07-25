import { Vec3 } from "vec3";
import { EventBus } from "../core/EventBus";
import { Entity } from "../entity/Entity";
import { distanceSquared } from "../utils/Vec3Utils";
import { Logger } from "../utils/Logger";

/**
 * Sunucudaki tüm entity'lerin (mob, item, projectile, araç, oyuncu)
 * yaşam döngüsünü Map<number, Entity> üzerinde takip eder. Map
 * kullanımı, binlerce entity olsa dahi ekleme/silme/arama işlemlerinin
 * O(1) karmaşıklıkta kalmasını sağlar (performans hedefi).
 */
export class EntityManager {
  private entities: Map<number, Entity> = new Map();

  constructor(private readonly bus: EventBus) {
    this.bus.on("packet:spawn_entity", (data: any) => this.handleSpawnEntity(data));
    this.bus.on("packet:named_entity_spawn", (data: any) => this.handleSpawnPlayerEntity(data));
    this.bus.on("packet:entity_destroy", (data: any) => this.handleDestroy(data));
    this.bus.on("packet:rel_entity_move", (data: any) => this.handleRelMove(data));
    this.bus.on("packet:entity_move_look", (data: any) => this.handleRelMove(data));
    this.bus.on("packet:entity_look", (data: any) => this.handleLook(data));
    this.bus.on("packet:entity_teleport", (data: any) => this.handleTeleport(data));
    this.bus.on("packet:entity_velocity", (data: any) => this.handleVelocity(data));
    this.bus.on("packet:entity_head_rotation", (data: any) => this.handleHeadRotation(data));
    this.bus.on("packet:entity_metadata", (data: any) => this.handleMetadata(data));
    this.bus.on("packet:entity_status", (data: any) => this.bus.emit("entityStatus", data));
  }

  private handleSpawnEntity(data: any): void {
    const position = new Vec3(data.x, data.y, data.z);
    const entity = new Entity(data.entityId, data.type ?? data.objectData ?? -1, position);
    entity.uuid = data.objectUUID ?? data.uuid;
    entity.yaw = (data.yaw ?? 0) * (360 / 256);
    entity.pitch = (data.pitch ?? 0) * (360 / 256);
    entity.velocity = new Vec3(
      (data.velocityX ?? 0) / 8000,
      (data.velocityY ?? 0) / 8000,
      (data.velocityZ ?? 0) / 8000
    );
    this.entities.set(entity.id, entity);
    this.bus.emit("entitySpawn", entity);
  }

  private handleSpawnPlayerEntity(data: any): void {
    const position = new Vec3(data.x, data.y, data.z);
    const entity = new Entity(data.entityId, -1, position);
    entity.uuid = data.playerUUID;
    entity.isPlayer = true;
    entity.yaw = (data.yaw ?? 0) * (360 / 256);
    entity.pitch = (data.pitch ?? 0) * (360 / 256);
    this.entities.set(entity.id, entity);
    this.bus.emit("entitySpawn", entity);
    this.bus.emit("playerEntitySpawn", entity);
  }

  private handleDestroy(data: any): void {
    const ids: number[] = data.entityIds ?? (data.entityId !== undefined ? [data.entityId] : []);
    for (const id of ids) {
      const entity = this.entities.get(id);
      if (entity) {
        this.entities.delete(id);
        this.bus.emit("entityGone", entity);
      }
    }
  }

  private handleRelMove(data: any): void {
    const entity = this.entities.get(data.entityId);
    if (!entity) return;
    if (data.dX !== undefined) {
      entity.position = entity.position.offset(data.dX / 4096, data.dY / 4096, data.dZ / 4096);
    }
    if (data.yaw !== undefined) entity.yaw = data.yaw * (360 / 256);
    if (data.pitch !== undefined) entity.pitch = data.pitch * (360 / 256);
    if (data.onGround !== undefined) entity.onGround = data.onGround;
    this.bus.emit("entityMoved", entity);
  }

  private handleLook(data: any): void {
    const entity = this.entities.get(data.entityId);
    if (!entity) return;
    entity.yaw = data.yaw * (360 / 256);
    entity.pitch = data.pitch * (360 / 256);
    this.bus.emit("entityMoved", entity);
  }

  private handleTeleport(data: any): void {
    const entity = this.entities.get(data.entityId);
    if (!entity) return;
    entity.position = new Vec3(data.x, data.y, data.z);
    entity.yaw = data.yaw * (360 / 256);
    entity.pitch = data.pitch * (360 / 256);
    entity.onGround = data.onGround ?? entity.onGround;
    this.bus.emit("entityMoved", entity);
  }

  private handleVelocity(data: any): void {
    const entity = this.entities.get(data.entityId);
    if (!entity) return;
    entity.velocity = new Vec3(data.velocityX / 8000, data.velocityY / 8000, data.velocityZ / 8000);
  }

  private handleHeadRotation(data: any): void {
    const entity = this.entities.get(data.entityId);
    if (!entity) return;
    entity.headYaw = data.headYaw * (360 / 256);
  }

  private handleMetadata(data: any): void {
    const entity = this.entities.get(data.entityId);
    if (!entity) return;
    for (const item of data.metadata ?? []) {
      entity.metadata[item.key] = item.value;
    }
    this.bus.emit("entityUpdated", entity);
  }

  register(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  get(id: number): Entity | undefined {
    return this.entities.get(id);
  }

  remove(id: number): void {
    const entity = this.entities.get(id);
    if (entity) {
      this.entities.delete(id);
      this.bus.emit("entityGone", entity);
    }
  }

  all(): Entity[] {
    return Array.from(this.entities.values());
  }

  get size(): number {
    return this.entities.size;
  }

  nearest(from: Vec3, predicate: (e: Entity) => boolean = () => true): Entity | null {
    let closest: Entity | null = null;
    let closestDistSq = Infinity;
    for (const entity of this.entities.values()) {
      if (!predicate(entity)) continue;
      const distSq = distanceSquared(from, entity.position);
      if (distSq < closestDistSq) {
        closestDistSq = distSq;
        closest = entity;
      }
    }
    return closest;
  }

  clear(): void {
    this.entities.clear();
  }
}
