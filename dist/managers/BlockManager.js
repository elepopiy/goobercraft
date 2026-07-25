"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockManager = void 0;
const vec3_1 = require("vec3");
const Logger_1 = require("../utils/Logger");
const FACE_VECTORS = [
    new vec3_1.Vec3(0, -1, 0), // bottom
    new vec3_1.Vec3(0, 1, 0), // top
    new vec3_1.Vec3(0, 0, -1), // north
    new vec3_1.Vec3(0, 0, 1), // south
    new vec3_1.Vec3(-1, 0, 0), // west
    new vec3_1.Vec3(1, 0, 0), // east
];
class BlockManager {
    bus;
    protocol;
    world;
    constructor(bus, protocol, world) {
        this.bus = bus;
        this.protocol = protocol;
        this.world = world;
        this.bus.on("packet:block_change", (data) => this.handleBlockChange(data));
        this.bus.on("packet:multi_block_change", (data) => this.handleMultiBlockChange(data));
    }
    handleBlockChange(data) {
        const pos = data.location ?? new vec3_1.Vec3(data.x, data.y, data.z);
        this.world.setBlockStateId(pos, data.type);
        this.bus.emit("blockUpdate", { position: pos, stateId: data.type });
    }
    handleMultiBlockChange(data) {
        const chunkCoords = data.chunkCoordinates ?? { x: data.chunkX, z: data.chunkZ };
        for (const record of data.records ?? []) {
            let localX;
            let localZ;
            let y;
            if (record.blockCoordinate !== undefined) {
                // 1.16.2+: tek bir BigInt içinde paketlenmiş (x<<40 | z<<20 | y) formatı
                const coord = BigInt(record.blockCoordinate);
                localX = Number((coord >> 40n) & 0xfn);
                localZ = Number((coord >> 20n) & 0xfn);
                y = Number(coord & 0xfffffn);
            }
            else {
                localX = (record.horizontalPos >> 4) & 0xf;
                localZ = record.horizontalPos & 0xf;
                y = record.y ?? 0;
            }
            const worldX = chunkCoords.x * 16 + localX;
            const worldZ = chunkCoords.z * 16 + localZ;
            const pos = new vec3_1.Vec3(worldX, y, worldZ);
            const stateId = record.blockId ?? record.type;
            this.world.setBlockStateId(pos, stateId);
            this.bus.emit("blockUpdate", { position: pos, stateId });
        }
    }
    digStart(position, face = new vec3_1.Vec3(0, 1, 0)) {
        this.protocol.write("block_dig", {
            status: 0, // start digging
            location: position,
            face: this.faceIndex(face),
            sequence: 0,
        });
    }
    digFinish(position, face = new vec3_1.Vec3(0, 1, 0)) {
        this.protocol.write("block_dig", {
            status: 2, // finish digging
            location: position,
            face: this.faceIndex(face),
            sequence: 0,
        });
    }
    digCancel(position, face = new vec3_1.Vec3(0, 1, 0)) {
        this.protocol.write("block_dig", {
            status: 1, // cancel digging
            location: position,
            face: this.faceIndex(face),
            sequence: 0,
        });
    }
    placeBlock(referencePosition, face, hand = 0) {
        this.protocol.write("block_place", {
            hand,
            location: referencePosition,
            direction: this.faceIndex(face),
            cursorX: 0.5,
            cursorY: 0.5,
            cursorZ: 0.5,
            insideBlock: false,
            sequence: 0,
        });
        Logger_1.Logger.debug("BlockManager", `blok yerleştirildi: ${referencePosition} yön=${face}`);
    }
    faceIndex(face) {
        for (let i = 0; i < FACE_VECTORS.length; i++) {
            const v = FACE_VECTORS[i];
            if (v.x === face.x && v.y === face.y && v.z === face.z)
                return i;
        }
        return 1;
    }
}
exports.BlockManager = BlockManager;
//# sourceMappingURL=BlockManager.js.map