import { Vec3 } from "vec3";
import { EntityData } from "../utils/types";
export declare class Entity implements EntityData {
    id: number;
    uuid?: string;
    type: number;
    kind?: string;
    name?: string;
    position: Vec3;
    velocity: Vec3;
    yaw: number;
    pitch: number;
    headYaw: number;
    onGround: boolean;
    metadata: Record<number, any>;
    isPlayer: boolean;
    health?: number;
    username?: string;
    constructor(id: number, type: number, position: Vec3);
    distanceTo(point: Vec3): number;
}
//# sourceMappingURL=Entity.d.ts.map