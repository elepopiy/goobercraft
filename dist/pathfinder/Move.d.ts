export = Move;
declare class Move extends Vec3 {
    constructor(x: any, y: any, z: any, remainingBlocks: any, cost: any, toBreak?: any[], toPlace?: any[], parkour?: boolean);
    remainingBlocks: any;
    cost: any;
    toBreak: any[];
    toPlace: any[];
    parkour: boolean;
    hash: string;
}
import { Vec3 } from "vec3";
//# sourceMappingURL=Move.d.ts.map