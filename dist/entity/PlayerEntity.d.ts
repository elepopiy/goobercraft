import { Vec3 } from "vec3";
import { Entity } from "./Entity";
export declare class PlayerEntity extends Entity {
    isPlayer: boolean;
    uuid: string;
    ping: number;
    gamemode: number;
    displayName?: string;
    constructor(id: number, uuid: string, position: Vec3, username?: string);
}
//# sourceMappingURL=PlayerEntity.d.ts.map