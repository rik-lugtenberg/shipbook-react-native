"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogType = void 0;
var LogType;
(function (LogType) {
    LogType["Message"] = "message";
    LogType["Exception"] = "exception";
    LogType["AppEvent"] = "appEvent";
    LogType["ScreenEvent"] = "screenEvent";
})(LogType = exports.LogType || (exports.LogType = {}));
class BaseLog {
    constructor(type) {
        this.type = type;
        this.time = new Date();
        this.orderId = ++BaseLog.count;
    }
}
exports.default = BaseLog;
BaseLog.count = 0;
