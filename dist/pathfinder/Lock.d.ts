export = Lock;
declare class Lock {
    _locked: boolean;
    _emitter: EventEmitter<[never]>;
    /**
     * Synchronous. Returns true if the lock was acquired. Return false if the lock is already held by something else.
     * @returns {boolean}
     */
    tryAcquire(): boolean;
    /**
     * Asynchronous. Resolves when the lock was acquired.
     * @returns {Promise<void>}
     */
    acquire(): Promise<void>;
    /**
     * Releases the lock.
     */
    release(): void;
}
import { EventEmitter } from "events";
//# sourceMappingURL=Lock.d.ts.map