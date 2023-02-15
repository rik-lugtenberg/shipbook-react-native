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
exports.StackTraceElement = void 0;
const base_log_1 = require("./base-log");
const stackTraceParser = require("stacktrace-parser");
class StackTraceElement {
    constructor(stackFrame) {
        var _a, _b, _c, _d, _e;
        this.methodName = (_a = stackFrame.methodName) !== null && _a !== void 0 ? _a : undefined;
        this.fileName = (_b = stackFrame.file) !== null && _b !== void 0 ? _b : undefined;
        this.lineNumber = (_c = stackFrame.lineNumber) !== null && _c !== void 0 ? _c : undefined;
        this.column = (_d = this.column) !== null && _d !== void 0 ? _d : undefined;
        this.arguments = (_e = this.arguments) !== null && _e !== void 0 ? _e : undefined;
    }
}
exports.StackTraceElement = StackTraceElement;
class Exception extends base_log_1.default {
    constructor(name, reason, stack) {
        super(base_log_1.LogType.Exception);
        this.name = name;
        this.reason = reason;
        this.stack = stack;
        // this.callStackSymbols = stack.split('\n');
    }
    getObj() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.stackTrace)
                return this;
            const stack = stackTraceParser.parse(this.stack);
            const symbolicateStackTrace = require("react-native/Libraries/Core/Devtools/symbolicateStackTrace");
            const stackTrace = (yield symbolicateStackTrace(stack)).stack;
            this.stackTrace = stackTrace.map(sf => new StackTraceElement(sf));
            return this;
        });
    }
}
exports.default = Exception;
