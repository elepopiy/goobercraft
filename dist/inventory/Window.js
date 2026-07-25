"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Window = void 0;
const Item_1 = require("./Item");
class Window {
    id;
    type;
    title;
    slotCount;
    slots;
    stateId = 0;
    constructor(id, type, title, slotCount) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.slotCount = slotCount;
        this.slots = Array.from({ length: slotCount }, (_, i) => Item_1.Item.empty(i));
    }
    setSlot(index, item) {
        if (index < 0 || index >= this.slots.length)
            return;
        this.slots[index] = item;
    }
    getSlot(index) {
        return this.slots[index] ?? Item_1.Item.empty(index);
    }
    findItemByName(name) {
        return this.slots.find((s) => s.present && s.name === name);
    }
    findEmptySlot() {
        return this.slots.findIndex((s) => s.isEmpty());
    }
    /** Hotbar için sabit aralık: oyuncu envanterinde 36-44 arası hotbar slotlarıdır. */
    static PLAYER_INVENTORY_SIZE = 46;
    static HOTBAR_START = 36;
    static HOTBAR_END = 44;
}
exports.Window = Window;
//# sourceMappingURL=Window.js.map