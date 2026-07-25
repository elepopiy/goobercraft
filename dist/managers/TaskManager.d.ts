import { Task } from "../types/Task";
export declare class TaskManager {
    private readonly queue;
    push(task: Task): void;
    pop(): Task | undefined;
    size(): number;
}
//# sourceMappingURL=TaskManager.d.ts.map