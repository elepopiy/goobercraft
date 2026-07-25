declare const _exports: {
    Pathfinder: typeof Pathfinder;
};
export = _exports;
declare class Pathfinder {
    bot: any;
    world: any;
    goal: any;
    path: any[];
    _moving: boolean;
    currentIndex: number;
    followTimer: NodeJS.Timeout | null;
    constructor(bot: any, world: any);
    /**
     * Mineflayer uyumlu
     * bot.pathfinder.setGoal(goal)
     */
    setGoal(goal: any): void;
    /**
     * Path hesaplama
     */
    computePath(): void;
    /**
     * Hareket ediyor mu?
     * API uyumu için fonksiyon
     */
    isMoving(): boolean;
    /**
     * Path takip
     */
    followPath(): void;
    /**
     * Durdur
     */
    stop(): void;
    /**
     * Promise tabanlı gitme
     */
    goto(goal: any): Promise<any>;
    getPath(): any[];
}
//# sourceMappingURL=Pathfinder.d.ts.map