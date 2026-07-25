import { Vec3 } from "vec3";
export declare function yawPitchToDirection(yaw: number, pitch: number): Vec3;
export declare function directionToYawPitch(direction: Vec3): {
    yaw: number;
    pitch: number;
};
export declare function lookAtYawPitch(from: Vec3, to: Vec3): {
    yaw: number;
    pitch: number;
};
export declare function normalizeYaw(yaw: number): number;
export declare function clampPitch(pitch: number): number;
export declare function floorVec3(v: Vec3): Vec3;
export declare function distanceSquared(a: Vec3, b: Vec3): number;
export declare function chunkKey(chunkX: number, chunkZ: number): string;
export declare function toChunkCoords(x: number, z: number): {
    chunkX: number;
    chunkZ: number;
};
//# sourceMappingURL=Vec3Utils.d.ts.map