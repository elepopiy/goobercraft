import { EventBus } from "./EventBus";
import { ProtocolManager } from "./ProtocolManager";
import { PluginManager } from "./PluginManager";
import { ResolvedBotOptions } from "../utils/types";
import { Logger } from "../utils/Logger";

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

// PATHFINDER
import { Pathfinder } from "../pathfinder/Pathfinder";

export class BotCore {
  public readonly bus = new EventBus();
  public readonly protocol: ProtocolManager;
  public readonly plugins = new PluginManager();

  private readonly botManager = new BotManager();
  private readonly nodeManager = new NodeManager();
  private readonly taskManager = new TaskManager();
  private readonly startedAt = Date.now();

  public readonly keepAlive: KeepAliveManager;
  public readonly login: LoginManager;
  public readonly spawnManager: SpawnManager;
  public readonly respawn: RespawnManager;
  public readonly teleport: TeleportManager;
  public readonly healthManager: HealthManager;
  public readonly foodManager: FoodManager;
  public readonly experience: ExperienceManager;
  public readonly chatManager: ChatManager;
  public readonly entities: EntityManager;
  public readonly players: PlayerManager;
  public readonly inventoryManager: InventoryManager;
  public readonly worldManager: WorldManager;
  public readonly time: TimeManager;
  public readonly weather: WeatherManager;
  public readonly movement: MovementManager;
  public readonly physics: PhysicsManager;

  public readonly pathfinder: PathfinderAPI;

  constructor(private readonly options: ResolvedBotOptions) {
    this.protocol = new ProtocolManager(options, this.bus);
    this.keepAlive = new KeepAliveManager(this.bus, this.protocol);
    this.login = new LoginManager(this.bus, this.protocol, options);
    this.teleport = new TeleportManager(this.bus, this.protocol);
    this.spawnManager = new SpawnManager(this.bus, this.teleport);
    this.healthManager = new HealthManager(this.bus);
    this.foodManager = new FoodManager(this.bus);
    this.experience = new ExperienceManager(this.bus);
    this.chatManager = new ChatManager(this.bus, this.protocol);
    this.entities = new EntityManager(this.bus);
    this.players = new PlayerManager(this.bus, this.entities);
    this.inventoryManager = new InventoryManager(this.bus, this.protocol);
    this.worldManager = new WorldManager(this.bus, this.protocol, options.version);
    this.time = new TimeManager(this.bus);
    this.weather = new WeatherManager(this.bus);
    this.respawn = new RespawnManager(this.bus, this.protocol, options.respawnOnDeath);

    this.movement = new MovementManager(
      this.bus,
      this.protocol,
      this.teleport,
      this.worldManager.blocks
    );

    this.physics = new PhysicsManager(
      this.bus,
      this.protocol,
      this.teleport,
      this.movement,
      this.worldManager
    );

    // =====================================================
    // PATHFINDER BAĞLANTISI
    // =====================================================
    const self = this;
    this.pathfinder = new Pathfinder(
      {
        get position() {
          return self.teleport?.position;
        },

        look(yaw: number, pitch: number) {
          self.movement?.look(yaw, pitch);
        },

        move(direction: string, state: boolean) {
          self.movement?.setControlState(direction as any, state);
        },

        stop() {
          self.movement?.stop();
        }
      },
      this.worldManager
    );

    this.bus.on("login", () => {
      if (this.login.playerEntityId !== null) {
        this.movement.setPlayerEntityId(this.login.playerEntityId);
      }
    });

    this.bus.on("spawn", () => {
      this.physics.start();
    });

    this.bus.on("_raw_end", () => {
      this.handleDisconnect();
    });

    this.bus.on("_raw_error", (err: Error) => {
      Logger.error("BotCore", "bağlantı hatası:", err);
      this.handleDisconnect();
    });
  }

  connect(): void {
    this.protocol.connect();
  }

  disconnect(reason?: string): void {
    this.safeStop();
    this.protocol.end(reason);
  }

  private handleDisconnect(): void {
    this.safeStop();
    this.bus.emit("end");
  }

  private safeStop(): void {
    try {
      this.pathfinder?.stop?.();
    } catch (e) {}

    try {
      this.physics?.stop?.();
    } catch (e) {}
  }

  public getUptime(): number {
    return Date.now() - this.startedAt;
  }

  public getBotManager(): BotManager {
    return this.botManager;
  }

  public getNodeManager(): NodeManager {
    return this.nodeManager;
  }

  public getTaskManager(): TaskManager {
    return this.taskManager;
  }
}