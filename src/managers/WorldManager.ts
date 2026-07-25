import { Vec3 } from "vec3";
import { World } from "../world/World";
import { raycast } from "../world/Raycast";
import { ChunkManager } from "./ChunkManager";
import { BlockManager } from "./BlockManager";
import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { RaycastResult } from "../utils/types";

export class WorldManager {
  public readonly world: World;
  public readonly chunks: ChunkManager;
  public readonly blocks: BlockManager;

  constructor(bus: EventBus, protocol: ProtocolManager, version: string) {
    this.world = new World();
    // getProtocolVersion callback'i ile lazy sürüm çözümlemesi sağlanır
    // (version "auto" ise gerçek sürüm ilk chunk paketine kadar bilinmez).
    this.chunks = new ChunkManager(bus, this.world, version, () => protocol.getVersion());
    this.blocks = new BlockManager(bus, protocol, this.world);
  }

  getBlock(position: Vec3): any | null {
    return this.world.getBlock(position);
  }

  getChunk(chunkX: number, chunkZ: number): any | undefined {
    return this.world.getColumn(chunkX, chunkZ);
  }

  getBiome(position: Vec3): number | null {
    return this.world.getBiome(position);
  }

  raycast(origin: Vec3, direction: Vec3, maxDistance = 5): RaycastResult | null {
    return raycast(this.world, origin, direction, maxDistance);
  }
}
