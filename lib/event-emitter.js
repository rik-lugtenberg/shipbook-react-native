"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_CHANGE = exports.CONNECTED = exports.CONFIG_CHANGE = exports.eventEmitter = void 0;
const eventemitter3_1 = require("eventemitter3");
exports.eventEmitter = new eventemitter3_1.EventEmitter();
exports.CONFIG_CHANGE = "io.shipbook.ShipBookSDK.config";
exports.CONNECTED = "io.shipbook.ShipBookSDK.connected";
exports.USER_CHANGE = "io.shipbook.ShipBookSDK.user";
