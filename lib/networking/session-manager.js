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
const event_emitter_1 = require("../event-emitter");
const event_manager_1 = require("../event-manager");
const exception_manager_1 = require("../exception-manager");
const inner_log_1 = require("../inner-log");
const log_manager_1 = require("../log-manager");
const login_1 = require("../models/login");
const storage_1 = require("../storage");
const connection_client_1 = require("./connection-client");
const connection_client_2 = require("./connection-client");
const defaultConfig = {
    appenders: [
        {
            type: "ConsoleAppender",
            name: "console",
            config: { pattern: "$message" }
        },
        {
            type: "SBCloudAppender",
            name: "cloud",
            config: {
                maxTime: 5,
                flushSeverity: "Warning"
            }
        }
    ],
    loggers: [
        {
            name: "",
            severity: "Verbose",
            appenderRef: "console"
        },
        {
            name: "",
            severity: "Verbose",
            appenderRef: "cloud"
        }
    ]
};
class SessionManager {
    constructor() {
        this.isInLoginRequest = false;
    }
    get loginObj() {
        if (this._loginObj)
            this._loginObj.user = this.user;
        return this._loginObj;
    }
    set loginObj(loginObj) {
        this._loginObj = loginObj;
    }
    login(appId, appKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let config = yield storage_1.default.getObj("config");
            if (!config)
                config = defaultConfig;
            this.readConfig(config);
            this.appId = appId;
            this.appKey = appKey;
            this.loginObj = new login_1.default(appId, appKey);
            return this.innerLogin();
        });
    }
    innerLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isInLoginRequest || !this.loginObj)
                return;
            this.isInLoginRequest = true;
            this.token = undefined;
            try {
                const loginObj = yield this.loginObj.getObj();
                const resp = yield connection_client_2.default.request('auth/loginSdk', loginObj, connection_client_1.HttpMethod.POST);
                this.isInLoginRequest = false;
                if (resp.ok) {
                    const json = yield resp.json();
                    inner_log_1.default.i('Succeeded! : ' + JSON.stringify(json));
                    this.token = json.token;
                    // set config information
                    this.readConfig(json.config);
                    event_emitter_1.eventEmitter.emit(event_emitter_1.CONNECTED);
                    storage_1.default.setObj('config', json.config);
                    return json.sessionUrl;
                }
                else {
                    inner_log_1.default.e('didn\'t succeed to log');
                    const text = yield resp.text();
                    if (text) {
                        inner_log_1.default.e('the info that was received: ' + text);
                    }
                    return;
                }
            }
            catch (e) {
                inner_log_1.default.e('there was an error with the request', e);
            }
        });
    }
    readConfig(config) {
        if (!config.exceptionReportDisabled)
            exception_manager_1.default.start();
        if (!config.eventLoggingDisabled)
            event_manager_1.default.enableAppState();
        else
            event_manager_1.default.removeAppState();
        log_manager_1.default.config(config);
    }
    logout() {
        this.token = undefined;
        this.user = undefined;
        if (this.loginObj)
            this.loginObj = new login_1.default(this.appId, this.appKey);
        this.innerLogin();
    }
    registerUser(userId, userName, fullName, email, phoneNumber, additionalInfo) {
        this.user = {
            userId, userName, fullName, email, phoneNumber, additionalInfo
        };
        if (this._loginObj)
            event_emitter_1.eventEmitter.emit(event_emitter_1.USER_CHANGE);
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const refresh = {
                token: this.token,
                appKey: this.loginObj.appKey
            };
            this.token = undefined;
            const resp = yield connection_client_1.default.request("auth/refreshSdkToken", refresh, connection_client_1.HttpMethod.POST);
            if (resp.ok) {
                let json = yield resp.json();
                this.token = json.token;
                return true;
            }
            else
                return false;
        });
    }
    getUUID() {
        var _a;
        return (_a = this.loginObj) === null || _a === void 0 ? void 0 : _a.udid;
    }
}
exports.default = new SessionManager();
