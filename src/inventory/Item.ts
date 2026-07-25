import { ItemStack } from "../utils/types";

export class Item implements ItemStack {
  slot: number;
  present: boolean;
  itemId?: number;
  itemCount?: number;
  nbt?: any;
  name?: string;

  constructor(data: Partial<ItemStack> & { slot: number }) {
    this.slot = data.slot;
    this.present = data.present ?? false;
    this.itemId = data.itemId;
    this.itemCount = data.itemCount;
    this.nbt = data.nbt;
    this.name = data.name;
  }

  static empty(slot: number): Item {
    return new Item({ slot, present: false });
  }

  static fromProtocolSlot(slot: number, raw: any, registry: any): Item {
    if (!raw || raw.present === false || raw.itemId === -1 || raw.blockId === -1 || raw.itemId === undefined) {
      return Item.empty(slot);
    }

    const itemId: number = raw.itemId ?? raw.blockId;
    const itemCount: number = raw.itemCount ?? raw.itemCount ?? 1;
    let name: string | undefined;

    try {
      name = registry?.items?.[itemId]?.name;
    } catch {
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

  toProtocolSlot(): any {
    if (!this.present) return { present: false };
    return {
      present: true,
      itemId: this.itemId,
      itemCount: this.itemCount,
      nbtData: this.nbt ?? null,
    };
  }

  isEmpty(): boolean {
    return !this.present || !this.itemCount || this.itemCount <= 0;
  }

  clone(): Item {
    return new Item({ ...this });
  }
}
