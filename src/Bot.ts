import { Vec3 } from "vec3";

import { BotCore } from "./core/BotCore";
import { GooberPlugin, PluginFactory } from "./core/PluginManager";
import crypto from "crypto";

import {
  ResolvedBotOptions,
  ControlName,
  RaycastResult
} from "./utils/types";

import { Entity } from "./entity/Entity";
import { Window } from "./inventory/Window";
import { Item } from "./inventory/Item";

import type { Goal } from "./pathfinder/types";
import { parseBotProfileAction, type BotProfileAction } from "./utils/botProfiles";
import { BotProfile } from "./utils/types";
import { askGroq } from "./utils/groq";

const CREATIVE_BUILD_ITEMS = [
  "minecraft:stone",
  "minecraft:dirt",
  "minecraft:oak_planks",
  "minecraft:glass",
  "minecraft:torch",
  "minecraft:crafting_table",
  "minecraft:pickaxe",
  "minecraft:axe",
  "minecraft:shovel"
];

/**
 * GooberCraft ana Bot API sınıfı.
 *
 * Mineflayer benzeri kullanıcı arayüzü sağlar:
 * bot.chat() / bot.on() / bot.entities / vb.
 */
export class Bot {
  private readonly core: BotCore;
  private readonly id: string;
  private readonly createdAt: number;
  private profile: BotProfile;
  private groqApiKey?: string;
  
  private nodeId: string | null = null;
  private connected = false;
  private destroyed = false;

  constructor(options: ResolvedBotOptions) {
    this.id = crypto.randomUUID();
    this.core = new BotCore(options);
    this.createdAt = Date.now();
    this.profile = options.profile ?? "stable";
    this.groqApiKey = (options as any).groqApiKey;

    this.core.bus.on("chat", (message: any) => this.handleProfileChat(message));
  }

  // ============================================================
  // LIFE CYCLE
  // ============================================================

  connect(): this {
    this.core.connect();
    this.connected = true;
    return this;
  }

  end(reason?: string): void {
    this.connected = false;
    this.destroyed = true;
    this.core.disconnect(reason);
  }

  // ============================================================
  // EVENTS
  // ============================================================

  on(event: string, listener: (...args: any[]) => void): this {
    this.core.bus.on(event, listener);
    return this;
  }

  once(event: string, listener: (...args: any[]) => void): this {
    this.core.bus.once(event, listener);
    return this;
  }

  off(event: string, listener: (...args: any[]) => void): this {
    this.core.bus.off(event, listener);
    return this;
  }

  // ============================================================
  // STATE
  // ============================================================

  get position(): Vec3 {
    return this.core.teleport.position;
  }

  get yaw(): number {
    return this.core.teleport.yaw;
  }

  get pitch(): number {
    return this.core.teleport.pitch;
  }

  get health(): number {
    return this.core.healthManager.health;
  }

  get food(): number {
    return this.core.foodManager.food;
  }

  get experience() {
    return this.core.experience.state;
  }

  get entities(): Entity[] {
    return this.core.entities.all();
  }

  get players() {
    return this.core.players.all();
  }

  get username(): string {
    return this.core.protocol.client?.username ?? "";
  }

  get uuid(): string | undefined {
    return (this.core.protocol.client as any)?.uuid;
  }

  get inventory(): Window {
    return this.core.inventoryManager.inventory;
  }

  get isDead(): boolean {
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

  setGoal(goal: Goal): void {
    this.core.pathfinder.setGoal(goal);
  }

  async goto(goal: Goal): Promise<void> {
    await this.core.pathfinder.goto(goal);
  }

  stopPath(): void {
    this.core.pathfinder.stop();
  }

  // ============================================================
  // CHAT
  // ============================================================

  chat(message: string): void {
    this.core.chatManager.send(message);
  }

  chatCommand(command: string): void {
    this.core.chatManager.sendCommand(command);
  }

  setProfile(profile: BotProfile): void {
    this.profile = profile;
  }

  getProfile(): BotProfile {
    return this.profile;
  }

  private handleProfileChat(message: any): void {
    const text = message?.text ?? "";
    const action = parseBotProfileAction(this.profile, text);

    if (action.type === "combat") {
      this.handleCombatBehavior();
      return;
    }

    if (action.type === "build") {
      this.handleBuildBehavior(action.detail);
      return;
    }

    if (action.type === "chat") {
      this.handleChatBehavior(action.detail);
    }
  }

  private handleCombatBehavior(): void {
    const target = this.findBestCombatTarget();
    if (!target) return;

    const delta = target.position.minus(this.position);
    const distance = Math.sqrt(delta.x * delta.x + delta.z * delta.z);

    this.lookAt(target.position);
    if (distance > 3) {
      this.move("forward", true);
      this.sprint(true);
      this.goto({
        isEnd: (pos: Vec3) => pos.distanceTo(target.position) <= 2.5,
        heuristic: (pos: Vec3) => pos.distanceTo(target.position),
      } as any);
    } else {
      this.move("forward", false);
      this.sprint(false);
      this.attack(target.id);
    }
  }

  private findBestCombatTarget(): Entity | null {
    const candidates = this.entities.filter((entity) => entity.isPlayer || entity.type !== -1);
    return candidates.sort((a, b) => this.position.distanceTo(a.position) - this.position.distanceTo(b.position))[0] ?? null;
  }

  private handleBuildBehavior(detail: string): void {
    const buildTarget = this.findBuildPosition(detail);
    const position = buildTarget ?? this.position.offset(0, 0, 1);
    this.chat(`Yapacağım: ${detail}`);

    if (this.core.login.gamemode === 1 || this.core.login.gamemode === 3) {
      this.handleCreativeBuild(detail, position);
      return;
    }

    this.placeBlock(position, new Vec3(0, 1, 0));
  }

  private findBuildPosition(detail: string): Vec3 | null {
    const ray = this.raycast(6);
    if (ray?.blockPosition) {
      return ray.blockPosition.offset(0, 1, 0);
    }

    const candidate = this.position.offset(0, 0, 1);
    if (detail.toLowerCase().includes("ev") || detail.toLowerCase().includes("kule")) {
      return candidate;
    }
    return null;
  }

  private async handleCreativeBuild(detail: string, position: Vec3): Promise<void> {
    const targetItemName = this.detectNeededItem(detail);
    if (targetItemName) {
      const equipped = this.core.inventoryManager.equip(targetItemName, "hand");
      if (equipped) {
        this.chat(`Creative modda ${targetItemName} bulup hazırladım.`);
      }
    }

    if (this.groqApiKey) {
      const prompt = `Builder botu için kısa bir plan üret: ${detail}. Sadece bir cümle yaz.`;
      const plan = await askGroq(prompt, this.groqApiKey);
      if (plan) {
        this.chat(plan);
      }
    }

    this.placeBlock(position, new Vec3(0, 1, 0));
  }

  private detectNeededItem(detail: string): string | null {
    const lower = detail.toLowerCase();
    if (lower.includes("duvar") || lower.includes("blok") || lower.includes("kule")) {
      return this.findInventoryItem(["minecraft:stone", "minecraft:dirt", "minecraft:oak_planks"]);
    }
    if (lower.includes("cam") || lower.includes("pencere") || lower.includes("glass")) {
      return this.findInventoryItem(["minecraft:glass"]);
    }
    if (lower.includes("ışık") || lower.includes("torch")) {
      return this.findInventoryItem(["minecraft:torch"]);
    }
    if (lower.includes("masa") || lower.includes("craft")) {
      return this.findInventoryItem(["minecraft:crafting_table"]);
    }
    return this.findInventoryItem(CREATIVE_BUILD_ITEMS);
  }

  private findInventoryItem(names: string[]): string | null {
    for (const name of names) {
      const item = this.core.inventoryManager.inventory.findItemByName(name);
      if (item?.present) {
        return name;
      }
    }
    return null;
  }

  private async handleChatBehavior(detail: string): Promise<void> {
    if (this.groqApiKey) {
      const answer = await askGroq(`Kısa ve doğal bir cevap ver: ${detail}`, this.groqApiKey);
      if (answer) {
        this.chat(answer);
        return;
      }
    }
    this.chat(`Ben ${this.username || "bot"} ve şu an ${detail} hakkında konuşuyorum.`);
  }

  // ============================================================
  // MOVEMENT
  // ============================================================

  look(yaw: number, pitch: number, force = false): void {
    this.core.movement.look(yaw, pitch, force);
  }

  lookAt(point: Vec3): void {
    this.core.movement.lookAt(point);
  }

  swingArm(hand: "right" | "left" = "right"): void {
    this.core.movement.swingArm(hand);
  }

  attack(entityOrId: Entity | number): void {
    const id = typeof entityOrId === "number" ? entityOrId : entityOrId.id;
    this.core.movement.attack(id);
  }

  useItem(hand: "right" | "left" = "right"): void {
    this.core.movement.useItem(hand);
  }

  interactEntity(entityOrId: Entity | number, hand: "right" | "left" = "right"): void {
    const id = typeof entityOrId === "number" ? entityOrId : entityOrId.id;
    this.core.movement.interactEntity(id, hand);
  }

  placeBlock(referencePosition: Vec3, face: Vec3): void {
    this.core.movement.placeBlock(referencePosition, face);
  }

  dig(position: Vec3, face?: Vec3): void {
    this.core.movement.dig(position, face);
  }

  cancelDig(): void {
    this.core.movement.cancelDig();
  }

  move(direction: ControlName, state = true): void {
    this.core.movement.move(direction, state);
  }

  jump(): void {
    this.core.movement.jump();
  }

  sneak(state = true): void {
    this.core.movement.sneak(state);
  }

  sprint(state = true): void {
    this.core.movement.sprint(state);
  }

  setControlState(control: ControlName, state: boolean): void {
    this.core.movement.setControlState(control, state);
  }

  stop(): void {
    this.core.movement.stop();
  }

  // ============================================================
  // ENTITY SYSTEM
  // ============================================================

  nearestEntity(predicate?: (e: Entity) => boolean): Entity | null {
    return this.core.entities.nearest(this.position, predicate);
  }

  nearestPlayer(): Entity | null {
    return this.core.entities.nearest(
      this.position,
      (e) => e.isPlayer && e.id !== this.core.login.playerEntityId
    );
  }

  // ============================================================
  // WORLD
  // ============================================================

  getBlock(position: Vec3): any | null {
    return this.core.worldManager.getBlock(position);
  }

  getChunk(chunkX: number, chunkZ: number): any | undefined {
    return this.core.worldManager.getChunk(chunkX, chunkZ);
  }

  getBiome(position: Vec3): number | null {
    return this.core.worldManager.getBiome(position);
  }

  raycast(maxDistance = 5): RaycastResult | null {
    const eyePos = this.position.offset(0, 1.62, 0);
    const { yawPitchToDirection } = require("./utils/Vec3Utils");
    const direction = yawPitchToDirection(this.yaw, this.pitch);

    return this.core.worldManager.raycast(eyePos, direction, maxDistance);
  }

  // ============================================================
  // INVENTORY
  // ============================================================

  equip(itemName: string, destination: "hand" | "off-hand" = "hand"): boolean {
    return this.core.inventoryManager.equip(itemName, destination);
  }

  unequip(): void {
    this.core.inventoryManager.unequip();
  }

  toss(itemName: string, amount = 1): boolean {
    return this.core.inventoryManager.toss(itemName, amount);
  }

  craft(recipeId: string, craftAll = false): void {
    this.core.inventoryManager.craft(recipeId, craftAll);
  }

  openChest(windowId?: number): Window | undefined {
    return this.core.inventoryManager.openChest(windowId);
  }

  openFurnace(windowId?: number): Window | undefined {
    return this.core.inventoryManager.openFurnace(windowId);
  }

  closeWindow(windowId: number): void {
    this.core.inventoryManager.closeWindow(windowId);
  }

  getHeldItem(): Item {
    return this.core.inventoryManager.getHeldItem();
  }

  setHeldHotbarSlot(index: number): void {
    this.core.inventoryManager.setHeldHotbarSlot(index);
  }

  // ============================================================
  // PLUGINS
  // ============================================================

  loadPlugin(plugin: GooberPlugin | PluginFactory): void {
    this.core.plugins.load(this, plugin);
  }

  unloadPlugin(name: string): boolean {
    return this.core.plugins.unload(this, name);
  }

  listPlugins(): string[] {
    return this.core.plugins.list();
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): number {
    return this.createdAt;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public isDestroyed(): boolean {
    return this.destroyed;
  }

  public getNodeId(): string | null {
    return this.nodeId;
  }

  public setNodeId(id: string): this {
    this.nodeId = id;
    return this;
  }
}