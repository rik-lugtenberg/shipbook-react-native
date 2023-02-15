"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const log_manager_1 = require("./log-manager");
const app_event_1 = require("./models/app-event");
const platform_1 = require("./platform");
class EventManager {
    enableAppState() {
        if (this.eventListener)
            return;
        this.eventListener = (state) => {
            const event = new app_event_1.default('change', state, platform_1.default.orientation);
            log_manager_1.default.push(event);
        };
        this.appStateSubscription = react_native_1.AppState.addEventListener("change", this.eventListener);
    }
    removeAppState() {
        if (this.appStateSubscription)
            this.appStateSubscription.remove();
        else if (this.eventListener)
            react_native_1.AppState.removeEventListener('change', this.eventListener); //for old versions or expo
        this.appStateSubscription = undefined;
    }
}
exports.default = new EventManager();
