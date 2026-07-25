import { EventBus } from "./EventBus";
import { ProtocolManager } from "./ProtocolManager";
import { PluginManager } from "./PluginManager";
import { ResolvedBotOptions } from "../utils/types";
import { KeepAliveManager } from "../managers/KeepAliveManager";
import { LoginManager } from "../managers/LoginManager";
import { SpawnManager } from "../managers/SpawnManager";
import { RespawnManager } from "../managers/RespawnManager";
import { TeleportManager } from "../managers/TeleportManager";
import { HealthManager } from "../managers/HealthManager";
import { PathfinderAPI } from "../pathfinder/types";
import { BotManager } from "../managers/BotManager";
import { NodeManager } from "../managers/NodeManager";
import { TaskManager } from "../managers/TaskManager";
import { FoodManager } from "../managers/FoodManager";
import { ExperienceManager } from "../managers/ExperienceManager";
import { ChatManager } from "../managers/ChatManager";
import { EntityManager } from "../managers/EntityManager";
import { PlayerManager } from "../managers/PlayerManager";
import { InventoryManager } from "../managers/InventoryManager";
import { WorldManager } from "../managers/WorldManager";
import { TimeManager } from "../managers/TimeManager";
import { WeatherManager } from "../managers/WeatherManager";
import { MovementManager } from "../managers/MovementManager";
import { PhysicsManager } from "../managers/PhysicsManager";
export declare class BotCore {
    private readonly options;
    readonly bus: EventBus;
    readonly protocol: ProtocolManager;
    readonly plugins: PluginManager;
    private readonly botManager;
    private readonly nodeManager;
    private readonly taskManager;
    private readonly startedAt;
    readonly keepAlive: KeepAliveManager;
    readonly login: LoginManager;
    readonly spawnManager: SpawnManager;
    readonly respawn: RespawnManager;
    readonly teleport: TeleportManager;
    readonly healthManager: HealthManager;
    readonly foodManager: FoodManager;
    readonly experience: ExperienceManager;
    readonly chatManager: ChatManager;
    readonly entities: EntityManager;
    readonly players: PlayerManager;
    readonly inventoryManager: InventoryManager;
    readonly worldManager: WorldManager;
    readonly time: TimeManager;
    readonly weather: WeatherManager;
    readonly movement: MovementManager;
    readonly physics: PhysicsManager;
    readonly pathfinder: PathfinderAPI;
    constructor(options: ResolvedBotOptions);
    connect(): void;
    disconnect(reason?: string): void;
    private handleDisconnect;
    /**
     * Çökme riskini tamamen önlemek için güvenli durdurma metodu
     */
    private safeStop;
    getUptime(): number;
    getBotManager(): BotManager;
    getNodeManager(): NodeManager;
    getTaskManager(): TaskManager;
}
//# sourceMappingURL=BotCore.d.ts.map