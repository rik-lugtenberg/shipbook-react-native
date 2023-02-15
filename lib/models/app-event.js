"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_event_1 = require("./base-event");
const base_log_1 = require("./base-log");
class AppEvent extends base_event_1.default {
    constructor(event, state, orientation) {
        super(base_log_1.LogType.AppEvent);
        this.event = event;
        this.state = state;
        this.orientation = orientation;
    }
}
exports.default = AppEvent;
