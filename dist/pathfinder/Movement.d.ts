export = Movements;
declare class Movements {
    constructor(bot: any);
    bot: any;
    canDig: boolean;
    digCost: number;
    placeCost: number;
    liquidCost: number;
    entityCost: number;
    dontCreateFlow: boolean;
    dontMineUnderFallingBlock: boolean;
    allow1by1towers: boolean;
    allowFreeMotion: boolean;
    allowParkour: boolean;
    allowSprinting: boolean;
    allowEntityDetection: boolean;
    entitiesToAvoid: Set<any>;
    passableEntities: Set<any>;
    interactableBlocks: Set<any>;
    blocksCantBreak: Set<any>;
    blocksToAvoid: Set<any>;
    liquids: Set<any>;
    gravityBlocks: Set<any>;
    climbables: Set<any>;
    emptyBlocks: Set<any>;
    replaceables: Set<any>;
    scafoldingBlocks: any[];
    fences: Set<any>;
    carpets: Set<any>;
    openable: Set<any>;
    canOpenDoors: boolean;
    exclusionAreasStep: any[];
    exclusionAreasBreak: any[];
    exclusionAreasPlace: any[];
    maxDropDown: number;
    infiniteLiquidDropdownDistance: boolean;
    entityIntersections: {};
    exclusionPlace(block: any): number;
    exclusionStep(block: any): number;
    exclusionBreak(block: any): number;
    countScaffoldingItems(): number;
    getScaffoldingItem(): any;
    clearCollisionIndex(): void;
    /**
     * Finds blocks intersected by entity bounding boxes
     * and sets the number of ents intersecting in a dict.
     * Ignores entities that do not affect block placement
     */
    updateCollisionIndex(): void;
    /**
     * Gets number of entities who's bounding box intersects the node + offset
     * @param {import('vec3').Vec3} pos node position
     * @param {number} dx X axis offset
     * @param {number} dy Y axis offset
     * @param {number} dz Z axis offset
     * @returns {number} Number of entities intersecting block
     */
    getNumEntitiesAt(pos: import("vec3").Vec3, dx: number, dy: number, dz: number): number;
    getBlock(pos: any, dx: any, dy: any, dz: any): any;
    /**
     * Takes into account if the block is within a break exclusion area.
     * @param {import('prismarine-block').Block} block
     * @returns
     */
    safeToBreak(block: import("prismarine-block").Block): boolean | 0;
    /**
     * Takes into account if the block is within the stepExclusionAreas. And returns 100 if a block to be broken is within break exclusion areas.
     * @param {import('prismarine-block').Block} block block
     * @param {[]} toBreak
     * @returns {number}
     */
    safeOrBreak(block: import("prismarine-block").Block, toBreak: []): number;
    getMoveJumpUp(node: any, dir: any, neighbors: any): void;
    getMoveForward(node: any, dir: any, neighbors: any): void;
    getMoveDiagonal(node: any, dir: any, neighbors: any): void;
    getLandingBlock(node: any, dir: any): any;
    getMoveDropDown(node: any, dir: any, neighbors: any): void;
    getMoveDown(node: any, neighbors: any): void;
    getMoveUp(node: any, neighbors: any): void;
    getMoveParkourForward(node: any, dir: any, neighbors: any): void;
    getNeighbors(node: any): any[];
}
//# sourceMappingURL=Movement.d.ts.map