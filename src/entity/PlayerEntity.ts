import { Vec3 } from "vec3";
import { Entity } from "./Entity";

export class PlayerEntity extends Entity {
  isPlayer = true;
  uuid: string;
  ping = 0;
  gamemode = 0;
  displayName?: string;

  constructor(id: number, uuid: string, position: Vec3, username?: string) {
    super(id, -1, position);
    this.uuid = uuid;
    this.username = username;
  }
}
