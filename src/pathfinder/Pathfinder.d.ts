import { Goal } from "./types";

export class Pathfinder {

    constructor(
        bot: any,
        world: any
    );

    public path: any[];

    setGoal(goal: Goal): void;

    goto(goal: Goal): Promise<void>;

    stop(): void;

    isMoving(): boolean;

    getPath(): any[];
}