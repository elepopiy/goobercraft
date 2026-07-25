import { BotManager } from "./BotManager";
import { NodeManager } from "./NodeManager";
import { TaskManager } from "./TaskManager";
import { UserManager } from "./UserManager";
export declare class GooberManager {
    private static instance;
    readonly bots: BotManager;
    readonly nodes: NodeManager;
    readonly tasks: TaskManager;
    readonly users: UserManager;
    private constructor();
    static getInstance(): GooberManager;
}
//# sourceMappingURL=GooberManager.d.ts.map