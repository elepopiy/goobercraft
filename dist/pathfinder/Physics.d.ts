export = Physics;
declare class Physics {
    constructor(bot: any);
    bot: any;
    world: {
        getBlock: (pos: any) => any;
    };
    /**
     *
     * @param {function} goal A function is the goal has been reached or not
     * @param {function} controller Controller that can change the current control State for the next tick
     * @param {number} ticks Number of ticks to simulate
     * @param {object} state Starting control state to begin the simulation with
     * @returns { import('prismarine-physics').PlayerState } A player state of the final simulation tick
     */
    simulateUntil(goal: Function, controller?: Function, ticks?: number, state?: object): any;
    simulateUntilNextTick(): any;
    simulateUntilOnGround(ticks?: number): any;
    canStraightLine(path: any, sprint?: boolean): boolean;
    canStraightLineBetween(n1: any, n2: any): any;
    canSprintJump(path: any, jumpAfter?: number): boolean;
    canWalkJump(path: any, jumpAfter?: number): boolean;
    getReached(path: any): (state: any) => boolean;
    getController(nextPoint: any, jump: any, sprint: any, jumpAfter?: number): (state: any, tick: any) => void;
}
//# sourceMappingURL=Physics.d.ts.map