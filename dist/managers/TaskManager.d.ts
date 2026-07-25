export interface TaskInfo {
    id: string;
    type: string;
    status: string;
    createdAt: number;
    payload: unknown;
}
export declare class TaskManager {
    private readonly tasks;
    add(task: TaskInfo): void;
    remove(id: string): boolean;
    get(id: string): TaskInfo | undefined;
    getAll(): TaskInfo[];
    count(): number;
}
//# sourceMappingURL=TaskManager.d.ts.map