import { Vec3 } from "vec3";
import { GooberPlugin, PluginFactory } from "./core/PluginManager";
import { ResolvedBotOptions, ControlName, RaycastResult } from "./utils/types";
import { Entity } from "./entity/Entity";
import { Window } from "./inventory/Window";
import { Item } from "./inventory/Item";
import type { Goal } from "./pathfinder/types";
import { BotProfile } from "./utils/types";
/**
 * GooberCraft ana Bot API sınıfı.
 *
 * Mineflayer benzeri kullanıcı arayüzü sağlar:
 * bot.chat() / bot.on() / bot.entities / vb.
 */
export declare class Bot {
    private readonly core;
    private readonly id;
    private readonly createdAt;
    private profile;
    private nodeId;
    private connected;
    private destroyed;
    constructor(options: ResolvedBotOptions);
    connect(): this;
    end(reason?: string): void;
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
    get position(): Vec3;
    get yaw(): number;
    get pitch(): number;
    get health(): number;
    get food(): number;
    get experience(): import("./utils/types").ExperienceState;
    get entities(): Entity[];
    get players(): import("./utils/types").PlayerData[];
    get username(): string;
    get uuid(): string | undefined;
    get inventory(): Window;
    get isDead(): boolean;
    get controlState(): import("./utils/types").ControlStates;
    get pathfinder(): import("./pathfinder/types").PathfinderAPI;
    setGoal(goal: Goal): void;
    goto(goal: Goal): Promise<void>;
    stopPath(): void;
    chat(message: string): void;
    chatCommand(command: string): void;
    setProfile(profile: BotProfile): void;
    getProfile(): BotProfile;
    private handleProfileChat;
    private handleCombatBehavior;
    private handleBuildBehavior;
    private handleCreativeBuild;
    private detectNeededItem;
    private findInventoryItem;
    private handleChatBehavior;
    look(yaw: number, pitch: number, force?: boolean): void;
    lookAt(point: Vec3): void;
    swingArm(hand?: "right" | "left"): void;
    attack(entityOrId: Entity | number): void;
    useItem(hand?: "right" | "left"): void;
    interactEntity(entityOrId: Entity | number, hand?: "right" | "left"): void;
    placeBlock(referencePosition: Vec3, face: Vec3): void;
    dig(position: Vec3, face?: Vec3): void;
    cancelDig(): void;
    move(direction: ControlName, state?: boolean): void;
    jump(): void;
    sneak(state?: boolean): void;
    sprint(state?: boolean): void;
    setControlState(control: ControlName, state: boolean): void;
    stop(): void;
    nearestEntity(predicate?: (e: Entity) => boolean): Entity | null;
    nearestPlayer(): Entity | null;
    getBlock(position: Vec3): any | null;
    getChunk(chunkX: number, chunkZ: number): any | undefined;
    getBiome(position: Vec3): number | null;
    raycast(maxDistance?: number): RaycastResult | null;
    equip(itemName: string, destination?: "hand" | "off-hand"): boolean;
    unequip(): void;
    toss(itemName: string, amount?: number): boolean;
    craft(recipeId: string, craftAll?: boolean): void;
    openChest(windowId?: number): Window | undefined;
    openFurnace(windowId?: number): Window | undefined;
    closeWindow(windowId: number): void;
    getHeldItem(): Item;
    setHeldHotbarSlot(index: number): void;
    loadPlugin(plugin: GooberPlugin | PluginFactory): void;
    unloadPlugin(name: string): boolean;
    listPlugins(): string[];
    getId(): string;
    getCreatedAt(): number;
    isConnected(): boolean;
    isDestroyed(): boolean;
    getNodeId(): string | null;
    setNodeId(id: string): this;
}
//# sourceMappingURL=Bot.d.ts.map