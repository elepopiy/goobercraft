export = Move;
import { Vec3 } from 'vec3';
declare class Move extends Vec3 {
    remainingBlocks: any;
    cost: any;
    toBreak: any[];
    toPlace: any[];
    parkour: boolean;
    hash: string;
    constructor(x: any, y: any, z: any, remainingBlocks: any, cost: any, toBreak?: any[], toPlace?: any[], parkour?: boolean);
}
//# sourceMappingURL=Move.d.ts.map