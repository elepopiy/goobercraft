import { Item } from "./Item";
export declare class Window {
    readonly id: number;
    readonly type: string | number;
    readonly title: string;
    readonly slotCount: number;
    slots: Item[];
    stateId: number;
    constructor(id: number, type: string | number, title: string, slotCount: number);
    setSlot(index: number, item: Item): void;
    getSlot(index: number): Item;
    findItemByName(name: string): Item | undefined;
    findEmptySlot(): number;
    /** Hotbar için sabit aralık: oyuncu envanterinde 36-44 arası hotbar slotlarıdır. */
    static readonly PLAYER_INVENTORY_SIZE = 46;
    static readonly HOTBAR_START = 36;
    static readonly HOTBAR_END = 44;
}
//# sourceMappingURL=Window.d.ts.map