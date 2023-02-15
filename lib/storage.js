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
const async_storage_1 = require("@react-native-async-storage/async-storage");
class Storage {
    setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield async_storage_1.default.setItem(key, value);
        });
    }
    getItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield async_storage_1.default.getItem(key);
        });
    }
    removeItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield async_storage_1.default.removeItem(key);
        });
    }
    setObj(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield async_storage_1.default.setItem(key, JSON.stringify(value));
        });
    }
    getObj(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield async_storage_1.default.getItem(key);
            if (!value)
                return undefined;
            return JSON.parse(value);
        });
    }
    pushArrayObj(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const sizeString = yield async_storage_1.default.getItem(`${key}_size`);
            let size = Number(sizeString !== null && sizeString !== void 0 ? sizeString : "0");
            let valuePairs = [];
            if (Array.isArray(value)) {
                for (let v of value) {
                    valuePairs.push([`${key}_${size}`, JSON.stringify(v)]);
                    ++size;
                }
            }
            else { //not array
                valuePairs.push([`${key}_${size}`, JSON.stringify(value)]);
                ++size;
            }
            valuePairs.push([`${key}_size`, size.toString()]);
            yield async_storage_1.default.multiSet(valuePairs);
        });
    }
    popAllArrayObj(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const sizeString = yield async_storage_1.default.getItem(`${key}_size`);
            let size = Number(sizeString !== null && sizeString !== void 0 ? sizeString : "0");
            if (size === 0)
                return [];
            let keys = [];
            for (let i = 0; i < size; ++i) {
                keys.push(`${key}_${i}`);
            }
            const values = yield async_storage_1.default.multiGet(keys);
            const objects = values.map(value => typeof (value[1]) === 'string' ? JSON.parse(value[1]) : undefined);
            keys.push(`${key}_size`);
            yield async_storage_1.default.multiRemove(keys);
            return objects;
        });
    }
    ;
    arraySize(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const sizeString = yield async_storage_1.default.getItem(`${key}_size`);
            return Number(sizeString !== null && sizeString !== void 0 ? sizeString : "0");
        });
    }
}
exports.default = new Storage();
