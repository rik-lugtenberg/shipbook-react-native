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
const inner_log_1 = require("./inner-log");
const log_1 = require("./log");
const log_manager_1 = require("./log-manager");
const screen_event_1 = require("./models/screen-event");
const connection_client_1 = require("./networking/connection-client");
const session_manager_1 = require("./networking/session-manager");
class Shipbook {
    static start(appId, appKey, url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield session_manager_1.default.login(appId, appKey);
        });
    }
    static enableInnerLog(enable) {
        inner_log_1.default.enabled = enable;
    }
    static setConnectionUrl(url) {
        connection_client_1.default.BASE_URL = url;
    }
    static registerUser(userId, userName, fullName, email, phoneNumber, additionalInfo) {
        session_manager_1.default.registerUser(userId, userName, fullName, email, phoneNumber, additionalInfo);
    }
    static logout() {
        session_manager_1.default.logout();
    }
    static getLogger(tag) {
        return new log_1.default(tag);
    }
    static flush() {
        log_manager_1.default.flush();
    }
    static screen(name) {
        const event = new screen_event_1.default(name);
        log_manager_1.default.push(event);
    }
    static getUUID() {
        return session_manager_1.default.getUUID();
    }
}
exports.default = Shipbook;
