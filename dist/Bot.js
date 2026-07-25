"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const BotCore_1 = require("./core/BotCore");
const crypto_1 = __importDefault(require("crypto"));
/**
 * GooberCraft ana Bot API sınıfı.
 *
 * Mineflayer benzeri kullanıcı arayüzü sağlar:
 *
 * bot.chat()
 * bot.on()
 * bot.entities
 * bot.pathfinder
 * bot.goto()
 */
class Bot {
    core;
    id;
    createdAt;
    nodeId = null;
    connected = false;
    destroyed = false;
    constructor(options) {
        this.id = crypto_1.default.randomUUID();
        this.core = new BotCore_1.BotCore(options);
        this.createdAt = Date.now();
    }
    // ============================================================
    // LIFE CYCLE
    // ============================================================
    connect() {
        this.core.connect();
        this.connected = true;
        return this;
    }
    end(reason) {
        this.connected = false;
        this.destroyed = true;
        this.core.disconnect(reason);
    }
    // ============================================================
    // EVENTS
    // ============================================================
    on(event, listener) {
        this.core.bus.on(event, listener);
        return this;
    }
    once(event, listener) {
        this.core.bus.once(event, listener);
        return this;
    }
    off(event, listener) {
        this.core.bus.off(event, listener);
        return this;
    }
    // ============================================================
    // STATE
    // ============================================================
    get position() {
        return this.core.teleport.position;
    }
    get yaw() {
        return this.core.teleport.yaw;
    }
    get pitch() {
        return this.core.teleport.pitch;
    }
    get health() {
        return this.core.healthManager.health;
    }
    get food() {
        return this.core.foodManager.food;
    }
    get experience() {
        return this.core.experience.state;
    }
    get entities() {
        return this.core.entities.all();
    }
    get players() {
        return this.core.players.all();
    }
    get username() {
        return this.core.protocol.client?.username ?? "";
    }
    get uuid() {
        return this.core.protocol.client?.uuid;
    }
    get inventory() {
        return this.core.inventoryManager.inventory;
    }
    get isDead() {
        return this.core.respawn.isDead();
    }
    get controlState() {
        return this.core.movement.controlState;
    }
    // ============================================================
    // PATHFINDER
    // ============================================================
    get pathfinder() {
        return this.core.pathfinder;
    }
    setGoal(goal) {
        this.core.pathfinder.setGoal(goal);
    }
    async goto(goal) {
        await this.core.pathfinder.goto(goal);
    }
    stopPath() {
        this.core.pathfinder.stop();
    }
    // ============================================================
    // CHAT
    // ============================================================
    chat(message) {
        this.core.chatManager.send(message);
    }
    chatCommand(command) {
        this.core.chatManager.sendCommand(command);
    }
    // ============================================================
    // MOVEMENT
    // ============================================================
    look(yaw, pitch, force = false) {
        this.core.movement.look(yaw, pitch, force);
    }
    lookAt(point) {
        this.core.movement.lookAt(point);
    }
    swingArm(hand = "right") {
        this.core.movement.swingArm(hand);
    }
    attack(entityOrId) {
        const id = typeof entityOrId === "number"
            ? entityOrId
            : entityOrId.id;
        this.core.movement.attack(id);
    }
    useItem(hand = "right") {
        this.core.movement.useItem(hand);
    }
    interactEntity(entityOrId, hand = "right") {
        const id = typeof entityOrId === "number"
            ? entityOrId
            : entityOrId.id;
        this.core.movement.interactEntity(id, hand);
    }
    placeBlock(referencePosition, face) {
        this.core.movement.placeBlock(referencePosition, face);
    }
    dig(position, face) {
        this.core.movement.dig(position, face);
    }
    cancelDig() {
        this.core.movement.cancelDig();
    }
    move(direction, state = true) {
        this.core.movement.move(direction, state);
    }
    jump() {
        this.core.movement.jump();
    }
    sneak(state = true) {
        this.core.movement.sneak(state);
    }
    sprint(state = true) {
        this.core.movement.sprint(state);
    }
    setControlState(control, state) {
        this.core.movement.setControlState(control, state);
    }
    stop() {
        this.core.movement.stop();
    }
    // ============================================================
    // ENTITY SYSTEM
    // ============================================================
    nearestEntity(predicate) {
        return this.core.entities.nearest(this.position, predicate);
    }
    nearestPlayer() {
        return this.core.entities.nearest(this.position, (e) => (e.isPlayer &&
            e.id !== this.core.login.playerEntityId));
    }
    // ============================================================
    // WORLD
    // ============================================================
    getBlock(position) {
        return this.core.worldManager.getBlock(position);
    }
    getChunk(chunkX, chunkZ) {
        return this.core.worldManager.getChunk(chunkX, chunkZ);
    }
    getBiome(position) {
        return this.core.worldManager.getBiome(position);
    }
    raycast(maxDistance = 5) {
        const eyePos = this.position.offset(0, 1.62, 0);
        const { yawPitchToDirection } = require("./utils/Vec3Utils");
        const direction = yawPitchToDirection(this.yaw, this.pitch);
        return this.core.worldManager.raycast(eyePos, direction, maxDistance);
    }
    // ============================================================
    // INVENTORY
    // ============================================================
    equip(itemName, destination = "hand") {
        return this.core.inventoryManager.equip(itemName, destination);
    }
    unequip() {
        this.core.inventoryManager.unequip();
    }
    toss(itemName, amount = 1) {
        return this.core.inventoryManager.toss(itemName, amount);
    }
    craft(recipeId, craftAll = false) {
        this.core.inventoryManager.craft(recipeId, craftAll);
    }
    openChest(windowId) {
        return this.core.inventoryManager.openChest(windowId);
    }
    openFurnace(windowId) {
        return this.core.inventoryManager.openFurnace(windowId);
    }
    closeWindow(windowId) {
        this.core.inventoryManager.closeWindow(windowId);
    }
    getHeldItem() {
        return this.core.inventoryManager.getHeldItem();
    }
    setHeldHotbarSlot(index) {
        this.core.inventoryManager.setHeldHotbarSlot(index);
    }
    // ============================================================
    // PLUGINS
    // ============================================================
    loadPlugin(plugin) {
        this.core.plugins.load(this, plugin);
    }
    unloadPlugin(name) {
        return this.core.plugins.unload(this, name);
    }
    listPlugins() {
        return this.core.plugins.list();
    }
    getId() {
        return this.id;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    isConnected() {
        return this.connected;
    }
    isDestroyed() {
        return this.destroyed;
    }
    getNodeId() {
        return this.nodeId;
    }
    setNodeId(id) {
        this.nodeId = id;
        return this;
    }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map