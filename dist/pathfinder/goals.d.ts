declare const _exports: {
    Goal: typeof Goal;
    GoalBlock: typeof GoalBlock;
    GoalNear: typeof GoalNear;
    GoalXZ: typeof GoalXZ;
    GoalNearXZ: typeof GoalNearXZ;
    GoalY: typeof GoalY;
    GoalGetToBlock: typeof GoalGetToBlock;
    GoalCompositeAny: typeof GoalCompositeAny;
    GoalCompositeAll: typeof GoalCompositeAll;
    GoalInvert: typeof GoalInvert;
    GoalFollow: typeof GoalFollow;
    GoalPlaceBlock: typeof GoalPlaceBlock;
    GoalBreakBlock: typeof GoalBreakBlock;
    GoalLookAtBlock: typeof GoalLookAtBlock;
};
export = _exports;
declare class Goal {
    heuristic(node: any): number;
    isEnd(node: any): boolean;
    hasChanged(): boolean;
    isValid(): boolean;
}
declare class GoalBlock extends Goal {
    x: number;
    y: number;
    z: number;
    constructor(x: any, y: any, z: any);
    heuristic(node: any): number;
    isEnd(node: any): boolean;
}
declare class GoalNear extends Goal {
    x: number;
    y: number;
    z: number;
    rangeSq: number;
    constructor(x: any, y: any, z: any, range: any);
    heuristic(node: any): number;
    isEnd(node: any): boolean;
}
declare class GoalXZ extends Goal {
    x: number;
    z: number;
    constructor(x: any, z: any);
    heuristic(node: any): number;
    isEnd(node: any): boolean;
}
declare class GoalNearXZ extends Goal {
    x: number;
    z: number;
    rangeSq: number;
    constructor(x: any, z: any, range: any);
    heuristic(node: any): number;
    isEnd(node: any): boolean;
}
declare class GoalY extends Goal {
    y: number;
    constructor(y: any);
    heuristic(node: any): number;
    isEnd(node: any): boolean;
}
declare class GoalGetToBlock extends Goal {
    x: number;
    y: number;
    z: number;
    constructor(x: any, y: any, z: any);
    heuristic(node: any): number;
    isEnd(node: any): boolean;
}
declare class GoalLookAtBlock extends Goal {
    pos: any;
    world: any;
    reach: any;
    entityHeight: any;
    constructor(pos: any, world: any, options?: {});
    heuristic(node: any): number;
    isEnd(node: any): boolean;
}
declare class GoalBreakBlock extends Goal {
    goal: GoalLookAtBlock;
    constructor(x: any, y: any, z: any, bot: any, options?: {});
    isEnd(): boolean;
    heuristic(node: any): number;
}
declare class GoalCompositeAny extends Goal {
    goals: any[];
    constructor(goals?: any[]);
    push(goal: any): void;
    heuristic(node: any): number;
    isEnd(node: any): boolean;
    hasChanged(): boolean;
    isValid(): any;
}
declare class GoalCompositeAll extends Goal {
    goals: any[];
    constructor(goals?: any[]);
    push(goal: any): void;
    heuristic(node: any): number;
    isEnd(node: any): boolean;
    hasChanged(): boolean;
    isValid(): any;
}
declare class GoalInvert extends Goal {
    goal: any;
    constructor(goal: any);
    heuristic(node: any): number;
    isEnd(node: any): boolean;
    hasChanged(): any;
    isValid(): any;
}
declare class GoalFollow extends Goal {
    entity: any;
    x: number;
    y: number;
    z: number;
    rangeSq: number;
    constructor(entity: any, range: any);
    heuristic(node: any): number;
    isEnd(node: any): boolean;
    hasChanged(): boolean;
    isValid(): boolean;
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
declare class GoalPlaceBlock extends Goal {
    pos: any;
    world: any;
    options: any;
    facesPos: any[][];
    constructor(pos: any, world: any, options: any);
    heuristic(node: any): number;
    isEnd(node: any): boolean;
    getFaceAndRef(headPos: any): {
        face: any;
        to: any;
        ref: any;
    } | null;
    checkFacing(dir: any): boolean;
    isStandingIn(node: any): boolean;
}
//# sourceMappingURL=Goals.d.ts.map