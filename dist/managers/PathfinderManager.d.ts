import { Vec3 } from "vec3";
import { EventBus } from "../core/EventBus";
import { WorldManager } from "./WorldManager";
import { MovementManager } from "./MovementManager";
import { TeleportManager } from "./TeleportManager";
export declare class PathfinderManager {
    private readonly bus;
    private readonly world;
    private readonly movement;
    private readonly teleport;
    private readonly pathfinder;
    constructor(bus: EventBus, world: WorldManager, movement: MovementManager, teleport: TeleportManager);
    private registerEvents;
    /**
     * Hedefe git
     */
    goto(position: Vec3): Promise<void>;
    /**
     * Pathfinder durdur
     */
    stop(): void;
    /**
     * Hareket ediyor mu?
     */
    get isMoving(): boolean;
    /**
     * Aktif path
     */
    getPath(): any[];
}
//# sourceMappingURL=PathfinderManager.d.ts.map