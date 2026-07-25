import { Vec3 } from "vec3";
import { Goal } from "./types";
export declare class GoalBlock implements Goal {
    readonly position: Vec3;
    constructor(position: Vec3);
    isEnd(position: Vec3): boolean;
    heuristic(position: Vec3): number;
}
//# sourceMappingURL=GoalBlock.d.ts.map