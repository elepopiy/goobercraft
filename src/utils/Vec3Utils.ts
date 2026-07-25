import { Vec3 } from "vec3";

export function yawPitchToDirection(yaw: number, pitch: number): Vec3 {
  const yawRad = (yaw * Math.PI) / 180;
  const pitchRad = (pitch * Math.PI) / 180;
  const x = -Math.sin(yawRad) * Math.cos(pitchRad);
  const y = -Math.sin(pitchRad);
  const z = Math.cos(yawRad) * Math.cos(pitchRad);
  return new Vec3(x, y, z).normalize();
}

export function directionToYawPitch(direction: Vec3): { yaw: number; pitch: number } {
  const d = direction.normalize();
  const yaw = (Math.atan2(-d.x, d.z) * 180) / Math.PI;
  const pitch = (Math.asin(-d.y) * 180) / Math.PI;
  return { yaw, pitch };
}

export function lookAtYawPitch(from: Vec3, to: Vec3): { yaw: number; pitch: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
  const yaw = (Math.atan2(-dx, dz) * 180) / Math.PI;
  const pitch = (Math.atan2(-dy, horizontalDistance) * 180) / Math.PI;
  return { yaw: normalizeYaw(yaw), pitch: clampPitch(pitch) };
}

export function normalizeYaw(yaw: number): number {
  let result = yaw % 360;
  if (result < -180) result += 360;
  if (result > 180) result -= 360;
  return result;
}

export function clampPitch(pitch: number): number {
  return Math.max(-90, Math.min(90, pitch));
}

export function floorVec3(v: Vec3): Vec3 {
  return new Vec3(Math.floor(v.x), Math.floor(v.y), Math.floor(v.z));
}

export function distanceSquared(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

export function chunkKey(chunkX: number, chunkZ: number): string {
  return `${chunkX},${chunkZ}`;
}

export function toChunkCoords(x: number, z: number): { chunkX: number; chunkZ: number } {
  return { chunkX: Math.floor(x / 16), chunkZ: Math.floor(z / 16) };
}
