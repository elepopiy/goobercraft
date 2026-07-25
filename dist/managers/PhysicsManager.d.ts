import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { TeleportManager } from "./TeleportManager";
import { MovementManager } from "./MovementManager";
import { WorldManager } from "./WorldManager";
export declare class PhysicsManager {
    private readonly bus;
    private readonly protocol;
    private readonly teleport;
    private readonly movement;
    private readonly world;
    private interval;
    private velocity;
    constructor(bus: EventBus, protocol: ProtocolManager, teleport: TeleportManager, movement: MovementManager, world: WorldManager);
    start(): void;
    stop(): void;
    private tick;
    private sendPosition;
    private isSolidBlock;
}
//# sourceMappingURL=PhysicsManager.d.ts.map