"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = require("./event-emitter");
const inner_log_1 = require("./inner-log");
const log_manager_1 = require("./log-manager");
const message_1 = require("./models/message");
const severity_1 = require("./models/severity");
class Log {
    constructor(tag) {
        this.tag = tag;
        this.severity = log_manager_1.default.getSeverity(tag);
        this.callStackSeverity = log_manager_1.default.getCallStackSeverity(tag);
        event_emitter_1.eventEmitter.addListener(event_emitter_1.CONFIG_CHANGE, () => {
            inner_log_1.default.i('config changed');
            this.severity = log_manager_1.default.getSeverity(tag);
            this.callStackSeverity = log_manager_1.default.getCallStackSeverity(tag);
        });
    }
    static e(msg, e) {
        Log.message(msg, severity_1.Severity.Error, e);
    }
    static w(msg, e) {
        Log.message(msg, severity_1.Severity.Warning, e);
    }
    static i(msg, e) {
        Log.message(msg, severity_1.Severity.Info, e);
    }
    static d(msg, e) {
        Log.message(msg, severity_1.Severity.Debug, e);
    }
    static v(msg, e) {
        Log.message(msg, severity_1.Severity.Verbose, e);
    }
    static message(msg, severity, error, tag, func, file, line) {
        let message;
        if (!tag) {
            message = new message_1.default(msg, severity, undefined, undefined, error, func, file, line);
            if (!message.tag)
                return;
            if (severity_1.SeverityUtil.value(severity) > severity_1.SeverityUtil.value(log_manager_1.default.getSeverity(message.tag)))
                return;
            const stackTrace = (severity_1.SeverityUtil.value(severity) <= severity_1.SeverityUtil.value(log_manager_1.default.getCallStackSeverity(message.tag))) ? new Error().stack : undefined;
            message.stackTrace = stackTrace;
        }
        else {
            if (severity_1.SeverityUtil.value(severity) > severity_1.SeverityUtil.value(log_manager_1.default.getSeverity(tag)))
                return;
            const stackTrace = (severity_1.SeverityUtil.value(severity) <= severity_1.SeverityUtil.value(log_manager_1.default.getCallStackSeverity(tag))) ? new Error().stack : undefined;
            message = new message_1.default(msg, severity, tag, stackTrace, error, func, file, line);
        }
        log_manager_1.default.push(message);
    }
    e(msg, e) {
        this.message(msg, severity_1.Severity.Error, e);
    }
    w(msg, e) {
        this.message(msg, severity_1.Severity.Warning, e);
    }
    i(msg, e) {
        this.message(msg, severity_1.Severity.Info, e);
    }
    d(msg, e) {
        this.message(msg, severity_1.Severity.Debug, e);
    }
    v(msg, e) {
        this.message(msg, severity_1.Severity.Verbose, e);
    }
    message(msg, severity, e, func, file, line, className) {
        if (severity_1.SeverityUtil.value(severity) > severity_1.SeverityUtil.value(this.severity))
            return;
        const stackTrace = (severity_1.SeverityUtil.value(severity) <= severity_1.SeverityUtil.value(this.callStackSeverity)) ? new Error().stack : undefined;
        const message = new message_1.default(msg, severity, this.tag, stackTrace, e, func, file, line);
        log_manager_1.default.push(message);
    }
}
exports.default = Log;
Log.counter = 0;
