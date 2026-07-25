import { Item } from "./Item";

export class Window {
  readonly id: number;
  readonly type: string | number;
  readonly title: string;
  readonly slotCount: number;
  slots: Item[];
  stateId = 0;

  constructor(id: number, type: string | number, title: string, slotCount: number) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.slotCount = slotCount;
    this.slots = Array.from({ length: slotCount }, (_, i) => Item.empty(i));
  }

  setSlot(index: number, item: Item): void {
    if (index < 0 || index >= this.slots.length) return;
    this.slots[index] = item;
  }

  getSlot(index: number): Item {
    return this.slots[index] ?? Item.empty(index);
  }

  findItemByName(name: string): Item | undefined {
    return this.slots.find((s) => s.present && s.name === name);
  }

  findEmptySlot(): number {
    return this.slots.findIndex((s) => s.isEmpty());
  }

  /** Hotbar için sabit aralık: oyuncu envanterinde 36-44 arası hotbar slotlarıdır. */
  static readonly PLAYER_INVENTORY_SIZE = 46;
  static readonly HOTBAR_START = 36;
  static readonly HOTBAR_END = 44;
}
