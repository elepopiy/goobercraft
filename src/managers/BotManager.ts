export interface ManagedBot {

    id: string;

    username: string;

    nodeId: string;

    online: boolean;

    createdAt: number;

}

export class BotManager {

    private readonly bots = new Map<string, ManagedBot>();

    public add(bot: ManagedBot): void {

        this.bots.set(bot.id, bot);

    }

    public remove(id: string): boolean {

        return this.bots.delete(id);

    }

    public get(id: string): ManagedBot | undefined {

        return this.bots.get(id);

    }

    public getAll(): ManagedBot[] {

        return [...this.bots.values()];

    }

    public clear(): void {

        this.bots.clear();

    }

    public count(): number {

        return this.bots.size;

    }

    public exists(id: string): boolean {

        return this.bots.has(id);

    }

}