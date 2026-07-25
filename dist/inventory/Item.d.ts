import { ItemStack } from "../utils/types";
export declare class Item implements ItemStack {
    slot: number;
    present: boolean;
    itemId?: number;
    itemCount?: number;
    nbt?: any;
    name?: string;
    constructor(data: Partial<ItemStack> & {
        slot: number;
    });
    static empty(slot: number): Item;
    static fromProtocolSlot(slot: number, raw: any, registry: any): Item;
    toProtocolSlot(): any;
    isEmpty(): boolean;
    clone(): Item;
}
//# sourceMappingURL=Item.d.ts.map