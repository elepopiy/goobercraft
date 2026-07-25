import { Client } from "minecraft-protocol";
import { ResolvedBotOptions } from "../utils/types";
import { EventBus } from "./EventBus";
import { MovementFlags } from "../utils/MovementPacketCompat";
/**
 * ProtocolManager, minecraft-protocol'un düşük seviye Client'ını yönetir.
 */
export declare class ProtocolManager {
    client: Client;
    private readonly options;
    private readonly bus;
    private closed;
    constructor(options: ResolvedBotOptions, bus: EventBus);
    connect(): void;
    write(name: string, params: Record<string, unknown>): void;
    getVersion(): string | undefined;
    writeMovement(name: string, protodefTypeName: string, base: Record<string, unknown>, flags: MovementFlags): void;
    end(reason?: string): void;
    isClosed(): boolean;
}
//# sourceMappingURL=ProtocolManager.d.ts.map