type Listener = (...args: any[]) => void;
/**
 * Node'un EventEmitter'ına benzer ama memory-leak önleme, once() ve
 * wildcard destekli hafif bir event bus. Binlerce entity event'i
 * yayınlansa bile listener listeleri Map/Set kullanarak O(1) erişime
 * sahiptir.
 */
export declare class EventBus {
    private listeners;
    private onceListeners;
    private maxListenersPerEvent;
    on(event: string, listener: Listener): this;
    once(event: string, listener: Listener): this;
    off(event: string, listener: Listener): this;
    removeAllListeners(event?: string): this;
    emit(event: string, ...args: any[]): boolean;
    listenerCount(event: string): number;
}
export {};
//# sourceMappingURL=EventBus.d.ts.map