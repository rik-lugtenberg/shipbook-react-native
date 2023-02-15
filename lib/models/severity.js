"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeverityUtil = exports.Severity = void 0;
var Severity;
(function (Severity) {
    Severity["Off"] = "Off";
    Severity["Error"] = "Error";
    Severity["Warning"] = "Warning";
    Severity["Info"] = "Info";
    Severity["Debug"] = "Debug";
    Severity["Verbose"] = "Verbose";
})(Severity = exports.Severity || (exports.Severity = {}));
class SeverityUtil {
    static value(severity) {
        switch (severity) {
            case Severity.Off: return 0;
            case Severity.Error: return 1;
            case Severity.Warning: return 2;
            case Severity.Info: return 3;
            case Severity.Debug: return 4;
            case Severity.Verbose: return 5;
            default: return 0;
        }
    }
}
exports.SeverityUtil = SeverityUtil;
