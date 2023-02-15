"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_event_1 = require("./base-event");
const base_log_1 = require("./base-log");
class ScreenEvent extends base_event_1.default {
    constructor(name) {
        super(base_log_1.LogType.ScreenEvent);
        this.name = name;
    }
}
exports.default = ScreenEvent;
