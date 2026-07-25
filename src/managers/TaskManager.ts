export interface TaskInfo {

    id: string;

    type: string;

    status: string;

    createdAt: number;

    payload: unknown;

}

export class TaskManager {

    private readonly tasks =
        new Map<string, TaskInfo>();

    public add(task: TaskInfo): void {

        this.tasks.set(task.id, task);

    }

    public remove(id: string): boolean {

        return this.tasks.delete(id);

    }

    public get(id: string): TaskInfo | undefined {

        return this.tasks.get(id);

    }

    public getAll(): TaskInfo[] {

        return [...this.tasks.values()];

    }

    public count(): number {

        return this.tasks.size;

    }

}g