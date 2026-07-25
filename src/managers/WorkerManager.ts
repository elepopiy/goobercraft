export interface WorkerInfo {

    id: string;

    name: string;

    host: string;

    port: number;

    maxBots: number;

    currentBots: number;

    cpu: number;

    ram: number;

    online: boolean;

    lastHeartbeat: number;

}

export class WorkerManager {

    private readonly workers =
        new Map<string, WorkerInfo>();

    public add(worker: WorkerInfo): void {

        this.workers.set(worker.id, worker);

    }

    public remove(id: string): boolean {

        return this.workers.delete(id);

    }

    public get(id: string): WorkerInfo | undefined {

        return this.workers.get(id);

    }

    public getAll(): WorkerInfo[] {

        return [...this.workers.values()];

    }

    public count(): number {

        return this.workers.size;

    }

}