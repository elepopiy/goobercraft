export = AStar;
declare class AStar {
    constructor(start: any, movements: any, goal: any, timeout: any, tickTimeout?: number, searchRadius?: number);
    startTime: number;
    movements: any;
    goal: any;
    timeout: any;
    tickTimeout: number;
    closedDataSet: Set<any>;
    openHeap: Heap;
    openDataMap: Map<any, any>;
    bestNode: PathNode;
    maxCost: number;
    visitedChunks: Set<any>;
    /**
     * @param {string} status
     * @param {PathNode} node
     * @returns {any}
     */
    makeResult(status: string, node: PathNode): any;
    /**
     * @returns {any}
     */
    compute(): any;
}
import Heap = require("./Heap.js");
declare class PathNode {
    data: any;
    g: number;
    h: number;
    f: number;
    parent: any;
    set(data: any, g: any, h: any, parent?: null): this;
}
//# sourceMappingURL=AStar.d.ts.map