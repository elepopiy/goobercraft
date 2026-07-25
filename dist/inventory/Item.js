"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
class Item {
    slot;
    present;
    itemId;
    itemCount;
    nbt;
    name;
    constructor(data) {
        this.slot = data.slot;
        this.present = data.present ?? false;
        this.itemId = data.itemId;
        this.itemCount = data.itemCount;
        this.nbt = data.nbt;
        this.name = data.name;
    }
    static empty(slot) {
        return new Item({ slot, present: false });
    }
    static fromProtocolSlot(slot, raw, registry) {
        if (!raw || raw.present === false || raw.itemId === -1 || raw.blockId === -1 || raw.itemId === undefined) {
            return Item.empty(slot);
        }
        const itemId = raw.itemId ?? raw.blockId;
        const itemCount = raw.itemCount ?? raw.itemCount ?? 1;
        let name;
        try {
            name = registry?.items?.[itemId]?.name;
        }
        catch {
            name = undefined;
        }
        return new Item({
            slot,
            present: true,
            itemId,
            itemCount,
            nbt: raw.nbtData ?? raw.nbt ?? null,
            name,
        });
    }
    toProtocolSlot() {
        if (!this.present)
            return { present: false };
        return {
            present: true,
            itemId: this.itemId,
            itemCount: this.itemCount,
            nbtData: this.nbt ?? null,
        };
    }
    isEmpty() {
        return !this.present || !this.itemCount || this.itemCount <= 0;
    }
    clone() {
        return new Item({ ...this });
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map