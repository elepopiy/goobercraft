import { Vec3 } from "vec3";
import { EventBus } from "../core/EventBus";
import { Entity } from "../entity/Entity";
/**
 * Sunucudaki tüm entity'lerin (mob, item, projectile, araç, oyuncu)
 * yaşam döngüsünü Map<number, Entity> üzerinde takip eder. Map
 * kullanımı, binlerce entity olsa dahi ekleme/silme/arama işlemlerinin
 * O(1) karmaşıklıkta kalmasını sağlar (performans hedefi).
 */
export declare class EntityManager {
    private readonly bus;
    private entities;
    constructor(bus: EventBus);
    private handleSpawnEntity;
    private handleSpawnPlayerEntity;
    private handleDestroy;
    private handleRelMove;
    private handleLook;
    private handleTeleport;
    private handleVelocity;
    private handleHeadRotation;
    private handleMetadata;
    register(entity: Entity): void;
    get(id: number): Entity | undefined;
    remove(id: number): void;
    all(): Entity[];
    get size(): number;
    nearest(from: Vec3, predicate?: (e: Entity) => boolean): Entity | null;
    clear(): void;
}
//# sourceMappingURL=EntityManager.d.ts.map