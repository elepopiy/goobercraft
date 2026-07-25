import { Vec3 } from "vec3";
import { World } from "../world/World";
import { ChunkManager } from "./ChunkManager";
import { BlockManager } from "./BlockManager";
import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { RaycastResult } from "../utils/types";
export declare class WorldManager {
    readonly world: World;
    readonly chunks: ChunkManager;
    readonly blocks: BlockManager;
    constructor(bus: EventBus, protocol: ProtocolManager, version: string);
    getBlock(position: Vec3): any | null;
    getChunk(chunkX: number, chunkZ: number): any | undefined;
    getBiome(position: Vec3): number | null;
    raycast(origin: Vec3, direction: Vec3, maxDistance?: number): RaycastResult | null;
}
//# sourceMappingURL=WorldManager.d.ts.map