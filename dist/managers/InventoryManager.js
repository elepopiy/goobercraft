"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryManager = void 0;
const Window_1 = require("../inventory/Window");
const Item_1 = require("../inventory/Item");
/**
 * Oyuncunun ana envanterini ve açık olan diğer pencereleri (sandık,
 * fırın, crafting masası vb.) senkronize eder. Sunucudan gelen
 * window_items / set_slot paketlerini dinler; equip/toss/craft gibi
 * yüksek seviyeli işlemleri window_click paketine çevirir.
 */
class InventoryManager {
    bus;
    protocol;
    inventory = new Window_1.Window(0, "inventory", "Inventory", Window_1.Window.PLAYER_INVENTORY_SIZE);
    openWindows = new Map();
    heldItemSlot = 36; // hotbar 0 -> slot index 36
    nextActionId = 1;
    registry;
    constructor(bus, protocol, registry) {
        this.bus = bus;
        this.protocol = protocol;
        this.registry = registry;
        this.openWindows.set(0, this.inventory);
        this.bus.on("packet:window_items", (data) => this.handleWindowItems(data));
        this.bus.on("packet:set_slot", (data) => this.handleSetSlot(data));
        this.bus.on("packet:held_item_slot", (data) => {
            this.heldItemSlot = 36 + data.slot;
        });
        this.bus.on("packet:open_window", (data) => this.handleOpenWindow(data));
        this.bus.on("packet:close_window", (data) => this.handleCloseWindow(data));
    }
    setRegistry(registry) {
        this.registry = registry;
    }
    windowFor(id) {
        return this.openWindows.get(id) ?? this.inventory;
    }
    handleWindowItems(data) {
        const window = this.windowFor(data.windowId);
        const items = data.items ?? [];
        items.forEach((raw, index) => {
            window.setSlot(index, Item_1.Item.fromProtocolSlot(index, raw, this.registry));
        });
        if (data.stateId !== undefined)
            window.stateId = data.stateId;
        this.bus.emit("inventoryUpdated", window);
    }
    handleSetSlot(data) {
        const window = this.windowFor(data.windowId);
        window.setSlot(data.slot, Item_1.Item.fromProtocolSlot(data.slot, data.item, this.registry));
        if (data.stateId !== undefined)
            window.stateId = data.stateId;
        this.bus.emit("inventoryUpdated", window);
        if (data.windowId === 0)
            this.bus.emit("slotUpdated", { slot: data.slot, item: window.getSlot(data.slot) });
    }
    handleOpenWindow(data) {
        const window = new Window_1.Window(data.windowId, data.inventoryType, this.flattenTitle(data.windowTitle), this.slotCountFor(data.inventoryType));
        this.openWindows.set(data.windowId, window);
        this.bus.emit("windowOpen", window);
    }
    handleCloseWindow(data) {
        const window = this.openWindows.get(data.windowId);
        this.openWindows.delete(data.windowId);
        if (window)
            this.bus.emit("windowClose", window);
    }
    flattenTitle(title) {
        if (!title)
            return "";
        if (typeof title === "string") {
            try {
                const parsed = JSON.parse(title);
                return parsed.text ?? title;
            }
            catch {
                return title;
            }
        }
        return title.text ?? "";
    }
    slotCountFor(type) {
        // Yaygın pencere boyutları: sandık=27, çift sandık=54, fırın=3, crafting masası=10
        if (type === "minecraft:generic_9x3" || type === 0)
            return 27 + 36;
        if (type === "minecraft:generic_9x6")
            return 54 + 36;
        if (type === "minecraft:furnace")
            return 3 + 36;
        if (type === "minecraft:crafting")
            return 10 + 36;
        return 27 + 36;
    }
    getOpenWindow(id) {
        return this.openWindows.get(id);
    }
    /** Belirtilen inventory slotundaki eşyayı hotbar'a taşıyıp eline alır. */
    equip(itemName, destination = "hand") {
        const source = this.inventory.findItemByName(itemName);
        if (!source)
            return false;
        if (destination === "hand") {
            const targetHotbarSlot = this.heldItemSlot;
            this.clickSlot(source.slot);
            this.clickSlot(targetHotbarSlot);
            this.clickSlot(source.slot);
            return true;
        }
        return this.swapToOffHand(source.slot);
    }
    swapToOffHand(slot) {
        this.protocol.write("window_click", {
            windowId: 0,
            stateId: this.inventory.stateId,
            slot,
            mouseButton: 40, // off-hand swap özel buton kodu
            mode: 0,
            changedSlots: [],
            cursorItem: { present: false },
        });
        return true;
    }
    unequip() {
        const heldSlot = this.heldItemSlot;
        const empty = this.inventory.findEmptySlot();
        if (empty === -1)
            return;
        this.clickSlot(heldSlot);
        this.clickSlot(empty);
    }
    toss(itemName, amount = 1) {
        const source = this.inventory.findItemByName(itemName);
        if (!source)
            return false;
        for (let i = 0; i < amount; i++) {
            this.protocol.write("window_click", {
                windowId: 0,
                stateId: this.inventory.stateId,
                slot: source.slot,
                mouseButton: 0,
                mode: 4, // drop mode
                changedSlots: [],
                cursorItem: { present: false },
            });
        }
        return true;
    }
    clickSlot(slot, mouseButton = 0, mode = 0) {
        this.protocol.write("window_click", {
            windowId: 0,
            stateId: this.inventory.stateId,
            slot,
            mouseButton,
            mode,
            changedSlots: [],
            cursorItem: { present: false },
        });
    }
    /**
     * Basit crafting: crafting grid'ine gerekli itemleri manuel
     * yerleştirmek yerine, sunucunun "craft_recipe_request" (shift-click
     * tarifi) paketini kullanır. recipeId, sunucunun tanıdığı tarif
     * kimliğidir (örn. "minecraft:stick").
     */
    craft(recipeId, craftAll = false) {
        this.protocol.write("craft_recipe_request", {
            windowId: this.inventory.id,
            recipe: recipeId,
            makeAll: craftAll,
        });
    }
    openChest(windowId) {
        if (windowId === undefined) {
            for (const window of this.openWindows.values()) {
                if (window.id !== 0 && typeof window.type === "string" && window.type.includes("generic"))
                    return window;
            }
            return undefined;
        }
        return this.openWindows.get(windowId);
    }
    openFurnace(windowId) {
        if (windowId === undefined) {
            for (const window of this.openWindows.values()) {
                if (window.id !== 0 && typeof window.type === "string" && window.type.includes("furnace"))
                    return window;
            }
            return undefined;
        }
        return this.openWindows.get(windowId);
    }
    closeWindow(windowId) {
        this.protocol.write("close_window", { windowId });
        this.openWindows.delete(windowId);
    }
    getHeldItem() {
        return this.inventory.getSlot(this.heldItemSlot);
    }
    setHeldHotbarSlot(hotbarIndex) {
        if (hotbarIndex < 0 || hotbarIndex > 8)
            return;
        this.heldItemSlot = 36 + hotbarIndex;
        this.protocol.write("held_item_slot", { slotId: hotbarIndex });
    }
}
exports.InventoryManager = InventoryManager;
//# sourceMappingURL=InventoryManager.js.map