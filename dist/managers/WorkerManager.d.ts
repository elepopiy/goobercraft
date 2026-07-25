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
export declare class WorkerManager {
    private readonly workers;
    add(worker: WorkerInfo): void;
    remove(id: string): boolean;
    get(id: string): WorkerInfo | undefined;
    getAll(): WorkerInfo[];
    count(): number;
}
//# sourceMappingURL=WorkerManager.d.ts.map