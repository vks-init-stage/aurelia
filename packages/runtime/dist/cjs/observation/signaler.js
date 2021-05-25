"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signaler = exports.ISignaler = void 0;
const kernel_1 = require("@aurelia/kernel");
exports.ISignaler = kernel_1.DI.createInterface('ISignaler', x => x.singleton(Signaler));
class Signaler {
    constructor() {
        this.signals = Object.create(null);
    }
    dispatchSignal(name, flags) {
        const listeners = this.signals[name];
        if (listeners === undefined) {
            return;
        }
        for (const listener of listeners.keys()) {
            listener.handleChange(undefined, undefined, flags);
        }
    }
    addSignalListener(name, listener) {
        const signals = this.signals;
        const listeners = signals[name];
        if (listeners === undefined) {
            signals[name] = new Set([listener]);
        }
        else {
            listeners.add(listener);
        }
    }
    removeSignalListener(name, listener) {
        const listeners = this.signals[name];
        if (listeners) {
            listeners.delete(listener);
        }
    }
}
exports.Signaler = Signaler;
//# sourceMappingURL=signaler.js.map