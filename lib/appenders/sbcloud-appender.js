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
const react_native_1 = require("react-native");
const inner_log_1 = require("../inner-log");
const base_log_1 = require("../models/base-log");
const exception_1 = require("../models/exception");
const severity_1 = require("../models/severity");
const connection_client_1 = require("../networking/connection-client");
const session_manager_1 = require("../networking/session-manager");
const queue_1 = require("../queue");
const storage_1 = require("../storage");
const event_emitter_1 = require("../event-emitter");
var DataType;
(function (DataType) {
    DataType["Token"] = "token";
    DataType["Login"] = "login";
    DataType["User"] = "user";
})(DataType || (DataType = {}));
const SESSION_DATA = 'session_data';
class SBCloudAppender {
    constructor(name, config) {
        this.maxTime = 3;
        this.flushSeverity = severity_1.Severity.Verbose;
        this.flushSize = 1000;
        this.maxLogSize = 5000;
        this.flushQueue = [];
        this.hasLog = false;
        this.eventListener = (state) => __awaiter(this, void 0, void 0, function* () {
            inner_log_1.default.d('Got state change: ' + state);
            if (state == 'background') {
                inner_log_1.default.d('entered background');
                yield this.send();
            }
        });
        this.aQueue = new queue_1.AutoQueue();
        this.name = name;
        this.update(config);
        this.appStateSubscription = react_native_1.AppState.addEventListener("change", this.eventListener);
        SBCloudAppender.started = true;
        this.changeUser = this.changeUser.bind(this);
        this.connected = this.connected.bind(this);
        event_emitter_1.eventEmitter.addListener(event_emitter_1.USER_CHANGE, this.changeUser);
        event_emitter_1.eventEmitter.addListener(event_emitter_1.CONNECTED, this.connected);
    }
    destructor() {
        inner_log_1.default.d('destructor called', this.appStateSubscription);
        if (this.appStateSubscription)
            this.appStateSubscription.remove();
        else
            react_native_1.AppState.removeEventListener('change', this.eventListener); //for old versions or expo
        this.appStateSubscription = undefined;
        event_emitter_1.eventEmitter.removeListener(event_emitter_1.USER_CHANGE, this.changeUser);
        event_emitter_1.eventEmitter.removeListener(event_emitter_1.CONNECTED, this.connected);
    }
    changeUser() {
        inner_log_1.default.i('user changed');
        let user = session_manager_1.default.user;
        if (user) {
            this.saveToStorage(user);
            this.createTimer();
        }
    }
    connected() {
        inner_log_1.default.i('Connected!');
        this.send();
    }
    update(config) {
        var _a, _b;
        this.maxTime = (_a = config.maxTime) !== null && _a !== void 0 ? _a : this.maxTime;
        this.flushSeverity = config.flushSeverity ? severity_1.Severity[config.flushSeverity] : this.flushSeverity;
        this.flushSize = (_b = config.flushSize) !== null && _b !== void 0 ? _b : this.flushSize;
    }
    push(log) {
        return __awaiter(this, void 0, void 0, function* () {
            if (log.type == base_log_1.LogType.Message)
                yield this.pushMessage(log);
            else if (log.type == base_log_1.LogType.Exception)
                yield this.pushException(log);
            else
                yield this.pushEvent(log);
        });
    }
    pushMessage(log) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield log.getObj();
            this.flushQueue.push(message);
            if (severity_1.SeverityUtil.value(this.flushSeverity) < severity_1.SeverityUtil.value(message.severity)) {
                inner_log_1.default.d('entered flush queue');
                if (this.flushQueue.length > this.flushSize) {
                    this.flushQueue.shift();
                }
            }
            else { // the info needs to be flushed and saved
                inner_log_1.default.d('entered save');
                const flushQueue = [...this.flushQueue];
                this.flushQueue = [];
                yield this.saveToStorage(flushQueue);
                this.createTimer();
            }
        });
    }
    pushException(exception) {
        return __awaiter(this, void 0, void 0, function* () {
            this.flushQueue.push(exception);
            const flushQueue = [...this.flushQueue];
            this.flushQueue = [];
            yield this.saveToStorage(flushQueue);
        });
    }
    pushEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.flushQueue.push(event);
            if (this.flushQueue.length > this.flushSize) {
                this.flushQueue.shift();
            }
        });
    }
    flush() {
        inner_log_1.default.d('flushed logs');
        this.send();
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            inner_log_1.default.d('entered send');
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = undefined;
            }
            if (!session_manager_1.default.token)
                return;
            const sessionsData = yield this.loadSessionData();
            if (sessionsData.length == 0)
                return;
            const resp = yield connection_client_1.default.request('sessions/uploadSavedData', sessionsData, connection_client_1.HttpMethod.POST);
            if (resp.ok) {
                const text = yield resp.text();
                inner_log_1.default.i('got ok of upload ' + text);
            }
            else {
                const text = yield resp.text();
                inner_log_1.default.e('got not ok of upload ' + text);
            }
        });
    }
    loadSessionData() {
        return __awaiter(this, void 0, void 0, function* () {
            let storageData = yield storage_1.default.popAllArrayObj(SESSION_DATA);
            this.hasLog = false;
            let sessionsData = [];
            let sessionData = undefined;
            if (storageData.length === 0)
                return [];
            for (let data of storageData) {
                switch (data.type) {
                    case DataType.Token:
                        if (sessionData)
                            sessionsData.push(sessionData);
                        sessionData = { token: data.data.token, logs: [] };
                        break;
                    case DataType.Login:
                        if (sessionData)
                            sessionsData.push(sessionData);
                        sessionData = { login: data.data, logs: [] };
                        break;
                    case DataType.User:
                        sessionData.user = data.data;
                        inner_log_1.default.i('the user data', sessionData === null || sessionData === void 0 ? void 0 : sessionData.user);
                        break;
                    case base_log_1.LogType.Exception:
                        const { name, reason, stack } = data.data;
                        let exception = yield (new exception_1.default(name, reason, stack)).getObj();
                        sessionData.logs.push(exception);
                        break;
                    default: // it is a log
                        if (!sessionData)
                            inner_log_1.default.e('session data is empty', storageData);
                        sessionData.logs.push(data.data);
                        break;
                }
            }
            if (sessionData)
                sessionsData.push(sessionData);
            return sessionsData;
        });
    }
    saveToStorage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let size = yield storage_1.default.arraySize(SESSION_DATA);
            if (size > this.maxLogSize)
                yield storage_1.default.popAllArrayObj(SESSION_DATA); // pop also deletes all
            let storageData = [];
            if (!this.hasLog) {
                this.hasLog = true;
                const { token, loginObj } = session_manager_1.default;
                if (token) {
                    storageData.push({
                        type: DataType.Token,
                        data: { token }
                    });
                }
                else if (loginObj) {
                    storageData.push({
                        type: DataType.Login,
                        data: loginObj
                    });
                }
            }
            if (Array.isArray(data)) {
                let logs = data;
                logs.forEach(log => {
                    storageData.push({
                        type: log.type,
                        data: log
                    });
                });
            }
            else { // User 
                storageData.push({
                    type: DataType.User,
                    data
                });
            }
            const task = () => __awaiter(this, void 0, void 0, function* () { return yield storage_1.default.pushArrayObj(SESSION_DATA, storageData); });
            yield this.aQueue.enqueue(task);
        });
    }
    createTimer() {
        if (this.timer)
            return;
        this.timer = setTimeout(() => {
            this.send();
            this.timer = undefined;
        }, this.maxTime * 1000);
    }
}
exports.default = SBCloudAppender;
SBCloudAppender.started = false;
