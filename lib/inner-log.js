"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InnerLog {
    constructor() {
        this.enabled = false;
    }
    e(message, ...optionalParams) {
        if (!this.enabled)
            return;
        console.error("Shipbook: " + message, ...optionalParams);
    }
    w(message, ...optionalParams) {
        if (!this.enabled)
            return;
        console.warn("Shipbook: " + message, ...optionalParams);
    }
    i(message, ...optionalParams) {
        if (!this.enabled)
            return;
        console.info("Shipbook: " + message, ...optionalParams);
    }
    d(message, ...optionalParams) {
        if (!this.enabled)
            return;
        console.debug("Shipbook: " + message, ...optionalParams);
    }
}
exports.default = new InnerLog();
