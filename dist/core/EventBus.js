"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
/**
 * Node'un EventEmitter'ına benzer ama memory-leak önleme, once() ve
 * wildcard destekli hafif bir event bus. Binlerce entity event'i
 * yayınlansa bile listener listeleri Map/Set kullanarak O(1) erişime
 * sahiptir.
 */
class EventBus {
    listeners = new Map();
    onceListeners = new Map();
    maxListenersPerEvent = 200;
    on(event, listener) {
        let set = this.listeners.get(event);
        if (!set) {
            set = new Set();
            this.listeners.set(event, set);
        }
        if (set.size >= this.maxListenersPerEvent) {
            // eslint-disable-next-line no-console
            console.warn(`[GooberCraft:EventBus] '${event}' olayı için ${this.maxListenersPerEvent}+ listener eklendi. Memory leak olabilir.`);
        }
        set.add(listener);
        return this;
    }
    once(event, listener) {
        let set = this.onceListeners.get(event);
        if (!set) {
            set = new Set();
            this.onceListeners.set(event, set);
        }
        set.add(listener);
        return this;
    }
    off(event, listener) {
        this.listeners.get(event)?.delete(listener);
        this.onceListeners.get(event)?.delete(listener);
        return this;
    }
    removeAllListeners(event) {
        if (event) {
            this.listeners.delete(event);
            this.onceListeners.delete(event);
        }
        else {
            this.listeners.clear();
            this.onceListeners.clear();
        }
        return this;
    }
    emit(event, ...args) {
        let handled = false;
        const regular = this.listeners.get(event);
        if (regular && regular.size > 0) {
            handled = true;
            for (const listener of Array.from(regular)) {
                try {
                    listener(...args);
                }
                catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(`[GooberCraft:EventBus] '${event}' listener hata fırlattı:`, err);
                }
            }
        }
        const once = this.onceListeners.get(event);
        if (once && once.size > 0) {
            handled = true;
            const toRun = Array.from(once);
            this.onceListeners.delete(event);
            for (const listener of toRun) {
                try {
                    listener(...args);
                }
                catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(`[GooberCraft:EventBus] '${event}' once-listener hata fırlattı:`, err);
                }
            }
        }
        return handled;
    }
    listenerCount(event) {
        return (this.listeners.get(event)?.size ?? 0) + (this.onceListeners.get(event)?.size ?? 0);
    }
}
exports.EventBus = EventBus;
//# sourceMappingURL=EventBus.js.map