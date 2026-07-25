"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotCore = void 0;
const EventBus_1 = require("./EventBus");
const ProtocolManager_1 = require("./ProtocolManager");
const PluginManager_1 = require("./PluginManager");
const Logger_1 = require("../utils/Logger");
const KeepAliveManager_1 = require("../managers/KeepAliveManager");
const LoginManager_1 = require("../managers/LoginManager");
const SpawnManager_1 = require("../managers/SpawnManager");
const RespawnManager_1 = require("../managers/RespawnManager");
const TeleportManager_1 = require("../managers/TeleportManager");
const HealthManager_1 = require("../managers/HealthManager");
const BotManager_1 = require("../managers/BotManager");
const NodeManager_1 = require("../managers/NodeManager");
const TaskManager_1 = require("../managers/TaskManager");
const FoodManager_1 = require("../managers/FoodManager");
const ExperienceManager_1 = require("../managers/ExperienceManager");
const ChatManager_1 = require("../managers/ChatManager");
const EntityManager_1 = require("../managers/EntityManager");
const PlayerManager_1 = require("../managers/PlayerManager");
const InventoryManager_1 = require("../managers/InventoryManager");
const WorldManager_1 = require("../managers/WorldManager");
const TimeManager_1 = require("../managers/TimeManager");
const WeatherManager_1 = require("../managers/WeatherManager");
const MovementManager_1 = require("../managers/MovementManager");
const PhysicsManager_1 = require("../managers/PhysicsManager");
// PATHFINDER
const Pathfinder_1 = require("../pathfinder/Pathfinder");
class BotCore {
    options;
    bus = new EventBus_1.EventBus();
    protocol;
    plugins = new PluginManager_1.PluginManager();
    botManager = new BotManager_1.BotManager();
    nodeManager = new NodeManager_1.NodeManager();
    taskManager = new TaskManager_1.TaskManager();
    startedAt = Date.now();
    keepAlive;
    login;
    spawnManager;
    respawn;
    teleport;
    healthManager;
    foodManager;
    experience;
    chatManager;
    entities;
    players;
    inventoryManager;
    worldManager;
    time;
    weather;
    movement;
    physics;
    pathfinder;
    constructor(options) {
        this.options = options;
        this.protocol =
            new ProtocolManager_1.ProtocolManager(options, this.bus);
        this.keepAlive =
            new KeepAliveManager_1.KeepAliveManager(this.bus, this.protocol);
        this.login =
            new LoginManager_1.LoginManager(this.bus, this.protocol, options);
        this.teleport =
            new TeleportManager_1.TeleportManager(this.bus, this.protocol);
        this.spawnManager =
            new SpawnManager_1.SpawnManager(this.bus, this.teleport);
        this.healthManager =
            new HealthManager_1.HealthManager(this.bus);
        this.foodManager =
            new FoodManager_1.FoodManager(this.bus);
        this.experience =
            new ExperienceManager_1.ExperienceManager(this.bus);
        this.chatManager =
            new ChatManager_1.ChatManager(this.bus, this.protocol);
        this.entities =
            new EntityManager_1.EntityManager(this.bus);
        this.players =
            new PlayerManager_1.PlayerManager(this.bus, this.entities);
        this.inventoryManager =
            new InventoryManager_1.InventoryManager(this.bus, this.protocol);
        this.worldManager =
            new WorldManager_1.WorldManager(this.bus, this.protocol, options.version);
        this.time =
            new TimeManager_1.TimeManager(this.bus);
        this.weather =
            new WeatherManager_1.WeatherManager(this.bus);
        this.respawn =
            new RespawnManager_1.RespawnManager(this.bus, this.protocol, options.respawnOnDeath);
        this.movement =
            new MovementManager_1.MovementManager(this.bus, this.protocol, this.teleport, this.worldManager.blocks);
        this.physics =
            new PhysicsManager_1.PhysicsManager(this.bus, this.protocol, this.teleport, this.movement, this.worldManager);
        // =====================================================
        // PATHFINDER BAĞLANTISI
        // =====================================================
        this.pathfinder =
            new Pathfinder_1.Pathfinder({
                get position() {
                    return this.teleport.position;
                },
                look(yaw, pitch) {
                    this.movement.look(yaw, pitch);
                },
                move(direction, state) {
                    this.movement.setControlState(direction, state);
                },
                stop() {
                    this.movement.stop();
                }
            }, this.worldManager);
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
        this.bus.on("_raw_error", (err) => {
            Logger_1.Logger.error("BotCore", "bağlantı hatası:", err);
        });
    }
    connect() {
        this.protocol.connect();
    }
    disconnect(reason) {
        this.pathfinder.stop();
        this.physics.stop();
        this.protocol.end(reason);
    }
    handleDisconnect() {
        this.pathfinder?.stop();
        this.physics.stop();
        this.bus.emit("end");
    }
    getUptime() {
        return Date.now() - this.startedAt;
    }
    getBotManager() {
        return this.botManager;
    }
    getNodeManager() {
        return this.nodeManager;
    }
    getTaskManager() {
        return this.taskManager;
    }
}
exports.BotCore = BotCore;
//# sourceMappingURL=BotCore.js.map