import { EventBus } from "../core/EventBus";
import { ProtocolManager } from "../core/ProtocolManager";
import { Window } from "../inventory/Window";
import { Item } from "../inventory/Item";
/**
 * Oyuncunun ana envanterini ve açık olan diğer pencereleri (sandık,
 * fırın, crafting masası vb.) senkronize eder. Sunucudan gelen
 * window_items / set_slot paketlerini dinler; equip/toss/craft gibi
 * yüksek seviyeli işlemleri window_click paketine çevirir.
 */
export declare class InventoryManager {
    private readonly bus;
    private readonly protocol;
    inventory: Window;
    private openWindows;
    private heldItemSlot;
    private nextActionId;
    private registry;
    constructor(bus: EventBus, protocol: ProtocolManager, registry?: any);
    setRegistry(registry: any): void;
    private windowFor;
    private handleWindowItems;
    private handleSetSlot;
    private handleOpenWindow;
    private handleCloseWindow;
    private flattenTitle;
    private slotCountFor;
    getOpenWindow(id: number): Window | undefined;
    /** Belirtilen inventory slotundaki eşyayı hotbar'a taşıyıp eline alır. */
    equip(itemName: string, destination?: "hand" | "off-hand"): boolean;
    private swapToOffHand;
    unequip(): void;
    toss(itemName: string, amount?: number): boolean;
    private clickSlot;
    /**
     * Basit crafting: crafting grid'ine gerekli itemleri manuel
     * yerleştirmek yerine, sunucunun "craft_recipe_request" (shift-click
     * tarifi) paketini kullanır. recipeId, sunucunun tanıdığı tarif
     * kimliğidir (örn. "minecraft:stick").
     */
    craft(recipeId: string, craftAll?: boolean): void;
    openChest(windowId?: number): Window | undefined;
    openFurnace(windowId?: number): Window | undefined;
    closeWindow(windowId: number): void;
    getHeldItem(): Item;
    setHeldHotbarSlot(hotbarIndex: number): void;
}
//# sourceMappingURL=InventoryManager.d.ts.map