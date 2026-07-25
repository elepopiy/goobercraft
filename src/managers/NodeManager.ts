export interface NodeInfo {

    id: string;

    name: string;

    maxBots: number;

    currentBots: number;

    online: boolean;

}

export class NodeManager {

    private readonly nodes =
        new Map<string, NodeInfo>();

    public add(node: NodeInfo): void {

        this.nodes.set(node.id, node);

    }

    public remove(id: string): boolean {

        this.nodes.delete(id);

    }

    public get(id: string): NodeInfo | undefined {

        return this.nodes.get(id);

    }

    public getAll(): NodeInfo[] {

        return [...this.nodes.values()];

    }

    public count(): number {

        return this.nodes.size;

    }

    public getAvailableNode():
        NodeInfo | undefined {

        return [...this.nodes.values()]
            .find(n =>
                n.online &&
                n.currentBots < n.maxBots
            );

    }

}