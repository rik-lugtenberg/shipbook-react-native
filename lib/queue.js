"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoQueue = void 0;
class Queue {
    constructor() {
        this._items = [];
        this._items = [];
    }
    enqueue(item) { this._items.push(item); }
    dequeue() { return this._items.shift(); }
    get size() { return this._items.length; }
}
class AutoQueue extends Queue {
    constructor() {
        super(...arguments);
        this._pendingPromise = false;
    }
    enqueue(action) {
        return new Promise((resolve, reject) => {
            super.enqueue({ action, resolve, reject });
            this.dequeue();
        });
    }
    dequeue() {
        const _super = Object.create(null, {
            dequeue: { get: () => super.dequeue }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this._pendingPromise)
                return false;
            let item = _super.dequeue.call(this);
            if (!item)
                return false;
            try {
                this._pendingPromise = true;
                let payload = yield item.action(this);
                this._pendingPromise = false;
                item.resolve(payload);
            }
            catch (e) {
                this._pendingPromise = false;
                item.reject(e);
            }
            finally {
                this.dequeue();
            }
            return true;
        });
    }
}
exports.AutoQueue = AutoQueue;
