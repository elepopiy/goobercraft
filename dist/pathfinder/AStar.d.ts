export = AStar;
import Heap = require("./heap.js");
declare class PathNode {
    data: any;
    g: number;
    h: number;
    f: number;
    parent: any;
    constructor();
    set(data: any, g: any, h: any, parent?: null): this;
}
declare class AStar {
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
    constructor(start: any, movements: any, goal: any, timeout: any, tickTimeout?: number, searchRadius?: number);
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
//# sourceMappingURL=AStar.d.ts.map