"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yawPitchToDirection = yawPitchToDirection;
exports.directionToYawPitch = directionToYawPitch;
exports.lookAtYawPitch = lookAtYawPitch;
exports.normalizeYaw = normalizeYaw;
exports.clampPitch = clampPitch;
exports.floorVec3 = floorVec3;
exports.distanceSquared = distanceSquared;
exports.chunkKey = chunkKey;
exports.toChunkCoords = toChunkCoords;
const vec3_1 = require("vec3");
function yawPitchToDirection(yaw, pitch) {
    const yawRad = (yaw * Math.PI) / 180;
    const pitchRad = (pitch * Math.PI) / 180;
    const x = -Math.sin(yawRad) * Math.cos(pitchRad);
    const y = -Math.sin(pitchRad);
    const z = Math.cos(yawRad) * Math.cos(pitchRad);
    return new vec3_1.Vec3(x, y, z).normalize();
}
function directionToYawPitch(direction) {
    const d = direction.normalize();
    const yaw = (Math.atan2(-d.x, d.z) * 180) / Math.PI;
    const pitch = (Math.asin(-d.y) * 180) / Math.PI;
    return { yaw, pitch };
}
function lookAtYawPitch(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
    const yaw = (Math.atan2(-dx, dz) * 180) / Math.PI;
    const pitch = (Math.atan2(-dy, horizontalDistance) * 180) / Math.PI;
    return { yaw: normalizeYaw(yaw), pitch: clampPitch(pitch) };
}
function normalizeYaw(yaw) {
    let result = yaw % 360;
    if (result < -180)
        result += 360;
    if (result > 180)
        result -= 360;
    return result;
}
function clampPitch(pitch) {
    return Math.max(-90, Math.min(90, pitch));
}
function floorVec3(v) {
    return new vec3_1.Vec3(Math.floor(v.x), Math.floor(v.y), Math.floor(v.z));
}
function distanceSquared(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
}
function chunkKey(chunkX, chunkZ) {
    return `${chunkX},${chunkZ}`;
}
function toChunkCoords(x, z) {
    return { chunkX: Math.floor(x / 16), chunkZ: Math.floor(z / 16) };
}
//# sourceMappingURL=Vec3Utils.js.map