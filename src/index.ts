// ==========================================
// GooberCraft Public API Exportları
// ==========================================

// Main Factory & Core Bot
export { createBot } from "./createBot";
export { Bot } from "./Bot";

// Core System & Managers (Cluster / Multi-node yönetimi için)
export { EventBus } from "./core/EventBus";
export { PluginManager } from "./core/PluginManager";

// Entities & World
export { Entity } from "./entity/Entity";
export { PlayerEntity } from "./entity/PlayerEntity";
export { World } from "./world/World";
export { raycast } from "./world/Raycast";

// Inventory
export { Window } from "./inventory/Window";
export { Item } from "./inventory/Item";

// Pathfinder & Utils
export { findPath } from "./pathfinder/SimplePathfinder";
export { Logger } from "./utils/Logger";

// Types
export type {
  BotOptions,
  ResolvedBotOptions,
  AuthMode,
  ChatMessage,
  EntityData,
  PlayerData,
  ItemStack,
  ControlStates,
  ControlName,
  RaycastResult,
  WeatherState,
  ExperienceState,
} from "./utils/types";

export type { GooberPlugin, PluginFactory } from "./core/PluginManager";