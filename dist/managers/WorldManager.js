"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldManager = void 0;
const World_1 = require("../world/World");
const Raycast_1 = require("../world/Raycast");
const ChunkManager_1 = require("./ChunkManager");
const BlockManager_1 = require("./BlockManager");
class WorldManager {
    world;
    chunks;
    blocks;
    constructor(bus, protocol, version) {
        this.world = new World_1.World();
        // getProtocolVersion callback'i ile lazy sürüm çözümlemesi sağlanır
        // (version "auto" ise gerçek sürüm ilk chunk paketine kadar bilinmez).
        this.chunks = new ChunkManager_1.ChunkManager(bus, this.world, version, () => protocol.getVersion());
        this.blocks = new BlockManager_1.BlockManager(bus, protocol, this.world);
    }
    getBlock(position) {
        return this.world.getBlock(position);
    }
    getChunk(chunkX, chunkZ) {
        return this.world.getColumn(chunkX, chunkZ);
    }
    getBiome(position) {
        return this.world.getBiome(position);
    }
    raycast(origin, direction, maxDistance = 5) {
        return (0, Raycast_1.raycast)(this.world, origin, direction, maxDistance);
    }
}
exports.WorldManager = WorldManager;
//# sourceMappingURL=WorldManager.js.map