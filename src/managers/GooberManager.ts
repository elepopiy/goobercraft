import { BotManager } from "./BotManager";
import { NodeManager } from "./NodeManager";
import { TaskManager } from "./TaskManager";

export class GooberManager {

    private static instance: GooberManager;

    public readonly bots: BotManager;
    public readonly nodes: NodeManager;
    public readonly tasks: TaskManager;

    private constructor() {

        this.bots = new BotManager();
        this.nodes = new NodeManager();
        this.tasks = new TaskManager();

    }

    public static getInstance(): GooberManager {

        if (!GooberManager.instance) {

            GooberManager.instance = new GooberManager();

        }

        return GooberManager.instance;

    }

}