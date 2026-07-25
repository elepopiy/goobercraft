import { BotManager } from "./BotManager";
import { NodeManager } from "./NodeManager";
import { TaskManager } from "./TaskManager";
import { UserManager } from "./UserManager";

export class GooberManager {

    private static instance: GooberManager;

    public readonly bots: BotManager;
    public readonly nodes: NodeManager;
    public readonly tasks: TaskManager;
    public readonly users: UserManager;

    private constructor() {

        this.bots = new BotManager();
        this.nodes = new NodeManager();
        this.tasks = new TaskManager();
        this.users = new UserManager();

    }

    public static getInstance(): GooberManager {

        if (!GooberManager.instance) {

            GooberManager.instance = new GooberManager();

        }

        return GooberManager.instance;

    }

}