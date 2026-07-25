import { Vec3 } from "vec3";
import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { World } from "../world/World";
export declare class BlockManager {
    private readonly bus;
    private readonly protocol;
    private readonly world;
    constructor(bus: EventBus, protocol: ProtocolManager, world: World);
    private handleBlockChange;
    private handleMultiBlockChange;
    digStart(position: Vec3, face?: Vec3): void;
    digFinish(position: Vec3, face?: Vec3): void;
    digCancel(position: Vec3, face?: Vec3): void;
    placeBlock(referencePosition: Vec3, face: Vec3, hand?: 0 | 1): void;
    private faceIndex;
}
//# sourceMappingURL=BlockManager.d.ts.map