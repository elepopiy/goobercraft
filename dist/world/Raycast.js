"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raycast = raycast;
const vec3_1 = require("vec3");
/**
 * Amanatides & Woo "A Fast Voxel Traversal Algorithm" temel alınarak
 * yazılmış grid-tabanlı raycast. Işın, karşılaştığı ilk "hava olmayan"
 * (boş olmayan) bloğa çarpana kadar voksel voksel ilerler.
 */
function raycast(world, origin, direction, maxDistance, isSolid = defaultIsSolid) {
    const dir = direction.normalize();
    let x = Math.floor(origin.x);
    let y = Math.floor(origin.y);
    let z = Math.floor(origin.z);
    const stepX = dir.x > 0 ? 1 : dir.x < 0 ? -1 : 0;
    const stepY = dir.y > 0 ? 1 : dir.y < 0 ? -1 : 0;
    const stepZ = dir.z > 0 ? 1 : dir.z < 0 ? -1 : 0;
    const tDeltaX = dir.x !== 0 ? Math.abs(1 / dir.x) : Infinity;
    const tDeltaY = dir.y !== 0 ? Math.abs(1 / dir.y) : Infinity;
    const tDeltaZ = dir.z !== 0 ? Math.abs(1 / dir.z) : Infinity;
    const nextBoundary = (coord, step) => (step > 0 ? Math.floor(coord) + 1 - coord : coord - Math.floor(coord));
    let tMaxX = dir.x !== 0 ? nextBoundary(origin.x, stepX) * tDeltaX : Infinity;
    let tMaxY = dir.y !== 0 ? nextBoundary(origin.y, stepY) * tDeltaY : Infinity;
    let tMaxZ = dir.z !== 0 ? nextBoundary(origin.z, stepZ) * tDeltaZ : Infinity;
    let travelled = 0;
    let lastFace = new vec3_1.Vec3(0, 0, 0);
    while (travelled <= maxDistance) {
        const block = world.getBlock(new vec3_1.Vec3(x, y, z));
        if (block && isSolid(block)) {
            const hitPoint = origin.plus(dir.scaled(travelled));
            return {
                position: hitPoint,
                blockPosition: new vec3_1.Vec3(x, y, z),
                face: lastFace,
                distance: travelled,
            };
        }
        if (tMaxX < tMaxY && tMaxX < tMaxZ) {
            x += stepX;
            travelled = tMaxX;
            tMaxX += tDeltaX;
            lastFace = new vec3_1.Vec3(-stepX, 0, 0);
        }
        else if (tMaxY < tMaxZ) {
            y += stepY;
            travelled = tMaxY;
            tMaxY += tDeltaY;
            lastFace = new vec3_1.Vec3(0, -stepY, 0);
        }
        else {
            z += stepZ;
            travelled = tMaxZ;
            tMaxZ += tDeltaZ;
            lastFace = new vec3_1.Vec3(0, 0, -stepZ);
        }
    }
    return null;
}
function defaultIsSolid(block) {
    if (!block)
        return false;
    if (typeof block.boundingBox === "string")
        return block.boundingBox === "block";
    if (typeof block.type === "number")
        return block.type !== 0; // 0 genelde air
    return false;
}
//# sourceMappingURL=Raycast.js.map