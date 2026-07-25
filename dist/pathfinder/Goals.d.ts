export class Goal {
    heuristic(node: any): number;
    isEnd(node: any): boolean;
    hasChanged(): boolean;
    isValid(): boolean;
}
export class GoalBlock extends Goal {
    constructor(x: any, y: any, z: any);
    x: number;
    y: number;
    z: number;
}
export class GoalNear extends Goal {
    constructor(x: any, y: any, z: any, range: any);
    x: number;
    y: number;
    z: number;
    rangeSq: number;
}
export class GoalXZ extends Goal {
    constructor(x: any, z: any);
    x: number;
    z: number;
}
export class GoalNearXZ extends Goal {
    constructor(x: any, z: any, range: any);
    x: number;
    z: number;
    rangeSq: number;
}
export class GoalY extends Goal {
    constructor(y: any);
    y: number;
}
export class GoalGetToBlock extends Goal {
    constructor(x: any, y: any, z: any);
    x: number;
    y: number;
    z: number;
}
export class GoalCompositeAny extends Goal {
    constructor(goals?: any[]);
    goals: any[];
    push(goal: any): void;
    isValid(): any;
}
export class GoalCompositeAll extends Goal {
    constructor(goals?: any[]);
    goals: any[];
    push(goal: any): void;
    isValid(): any;
}
export class GoalInvert extends Goal {
    constructor(goal: any);
    goal: any;
    hasChanged(): any;
    isValid(): any;
}
export class GoalFollow extends Goal {
    constructor(entity: any, range: any);
    entity: any;
    x: number;
    y: number;
    z: number;
    rangeSq: number;
}
/**
 * Options:
 * - range - maximum distance from the clicked face
 * - faces - the directions of the faces the player can click
 * - facing - the direction the player must be facing
 * - facing3D - boolean, facing is 3D (true) or 2D (false)
 * - half - 'top' or 'bottom', the half that must be clicked
 * - LOS - true or false, should the bot have line of sight off the placement face. Default true.
 */
export class GoalPlaceBlock extends Goal {
    constructor(pos: any, world: any, options: any);
    pos: any;
    world: any;
    options: any;
    facesPos: any[][];
    getFaceAndRef(headPos: any): {
        face: any;
        to: any;
        ref: any;
    } | null;
    checkFacing(dir: any): boolean;
    isStandingIn(node: any): boolean;
}
export class GoalBreakBlock extends Goal {
    constructor(x: any, y: any, z: any, bot: any, options?: {});
    goal: GoalLookAtBlock;
    isEnd(): boolean;
}
export class GoalLookAtBlock extends Goal {
    constructor(pos: any, world: any, options?: {});
    pos: any;
    world: any;
    reach: any;
    entityHeight: any;
}
//# sourceMappingURL=Goals.d.ts.map