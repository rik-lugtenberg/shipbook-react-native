"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appender_factory_1 = require("./appenders/appender-factory");
const event_emitter_1 = require("./event-emitter");
const inner_log_1 = require("./inner-log");
const severity_1 = require("./models/severity");
class LogManager {
    constructor() {
        this.appenders = new Map();
        this.loggers = [];
    }
    clear() {
        this.appenders.forEach(appender => appender.destructor());
        inner_log_1.default.d('called clear');
        this.appenders.clear();
        this.loggers = [];
    }
    add(appender, name) {
        const origAppender = this.appenders.get(name);
        if (appender != origAppender)
            appender === null || appender === void 0 ? void 0 : appender.destructor();
        this.appenders.set(name, appender);
    }
    remove(appenderName) {
        const appender = this.appenders.get(appenderName);
        appender === null || appender === void 0 ? void 0 : appender.destructor();
        this.appenders.delete(appenderName);
    }
    push(log) {
        if (log.type == 'message') {
            const message = log;
            let appenderNames = new Set();
            this.loggers.forEach(logger => {
                if (message.tag.startsWith(logger.key) && severity_1.SeverityUtil.value(message.severity) <= severity_1.SeverityUtil.value(logger.severity)) {
                    appenderNames.add(logger.appender.name);
                }
            });
            appenderNames.forEach(name => {
                var _a;
                (_a = this.appenders.get(name)) === null || _a === void 0 ? void 0 : _a.push(log);
            });
        }
        else { // isn't a message and therefor there isn't any tags
            this.appenders.forEach(appender => {
                appender.push(log);
            });
        }
    }
    flush() {
        this.appenders.forEach(appender => appender.flush());
    }
    getSeverity(tag) {
        let severity = severity_1.Severity.Off;
        this.loggers.forEach(logger => {
            if (tag.startsWith(logger.key) && severity_1.SeverityUtil.value(logger.severity) > severity_1.SeverityUtil.value(severity))
                severity = logger.severity;
        });
        return severity;
    }
    getCallStackSeverity(tag) {
        let callStackSeverity = severity_1.Severity.Off;
        this.loggers.forEach(logger => {
            if (tag.startsWith(logger.key) && severity_1.SeverityUtil.value(logger.callStackSeverity) > severity_1.SeverityUtil.value(callStackSeverity))
                callStackSeverity = logger.callStackSeverity;
        });
        return callStackSeverity;
    }
    config(conf) {
        // appenders
        this.clear();
        conf.appenders.forEach(appender => {
            try {
                const base = appender_factory_1.default.create(appender.type, appender.name, appender.config);
                this.appenders.set(appender.name, base);
            }
            catch (e) {
                inner_log_1.default.e('didn\'t succeed to create appender: wrong appender name: ' + appender.name);
            }
        });
        // loggers 
        this.loggers = [];
        conf.loggers.forEach(logger => {
            var _a, _b;
            const appender = this.appenders.get(logger.appenderRef);
            if (appender) {
                const log = {
                    key: (_a = logger.name) !== null && _a !== void 0 ? _a : '',
                    severity: logger.severity,
                    callStackSeverity: (_b = logger.callStackSeverity) !== null && _b !== void 0 ? _b : severity_1.Severity.Off,
                    appender: appender
                };
                this.loggers.push(log);
            }
        });
        event_emitter_1.eventEmitter.emit(event_emitter_1.CONFIG_CHANGE);
    }
}
exports.default = new LogManager();
