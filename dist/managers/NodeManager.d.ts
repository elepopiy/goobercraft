import { NodeInfo } from "../types/NodeInfo";
export declare class NodeManager {
    private readonly nodes;
    register(node: NodeInfo): void;
    get(id: string): NodeInfo | undefined;
    getAll(): NodeInfo[];
    getAvailableNode(): NodeInfo;
}
//# sourceMappingURL=NodeManager.d.ts.map