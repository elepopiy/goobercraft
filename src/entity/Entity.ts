import { Vec3 } from "vec3";
import { EntityData } from "../utils/types";

export class Entity implements EntityData {
  id: number;
  uuid?: string;
  type: number;
  kind?: string;
  name?: string;
  position: Vec3;
  velocity: Vec3;
  yaw = 0;
  pitch = 0;
  headYaw = 0;
  onGround = true;
  metadata: Record<number, any> = {};
  isPlayer = false;
  health?: number;
  username?: string;

  constructor(id: number, type: number, position: Vec3) {
    this.id = id;
    this.type = type;
    this.position = position;
    this.velocity = new Vec3(0, 0, 0);
  }

  distanceTo(point: Vec3): number {
    return this.position.distanceTo(point);
  }
}
