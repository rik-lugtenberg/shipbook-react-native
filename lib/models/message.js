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
const stackTraceParser = require("stacktrace-parser");
const base_log_1 = require("./base-log");
class Message extends base_log_1.default {
    constructor(message, severity, tag, stackTrace, error, func, file, line) {
        super(base_log_1.LogType.Message);
        this.resolveList = [];
        this.stackReceived = false;
        this.message = message;
        this.severity = severity;
        this.tag = tag;
        this.stackTrace = stackTrace;
        this.error = error;
        this.function = func;
        this.fileName = file;
        this.lineNumber = line;
        if (!file) {
            const stackString = new Error().stack;
            let stack = stackTraceParser.parse(stackString);
            stack.splice(0, 3);
            const symbolicateStackTrace = (stack) => new Promise(resolve => resolve({ stack }));
            symbolicateStackTrace(stack).then((stackTrace) => {
                var _a, _b, _c, _d, _e;
                stack = stackTrace.stack;
                const frame = stack.find(f => !Message.ignoreClasses.has(f.methodName)); // TODO: not correct
                if (frame) {
                    this.function = frame.methodName;
                    this.fileName = (_a = frame.file) !== null && _a !== void 0 ? _a : undefined;
                    this.lineNumber = (_b = frame.lineNumber) !== null && _b !== void 0 ? _b : undefined;
                }
                if (!tag) {
                    let index = (_c = this.fileName) === null || _c === void 0 ? void 0 : _c.lastIndexOf('.');
                    this.tag = (_e = (_d = this.fileName) === null || _d === void 0 ? void 0 : _d.substring(index + 1)) !== null && _e !== void 0 ? _e : '<unknown>';
                }
                this.stackReceived = true;
                this.resolveList.forEach(resolve => resolve(this));
                this.resolveList = [];
            });
        }
        // TODO make that it will except exceptions 
    }
    getObj() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.stackReceived) {
                let promise = new Promise((resolve) => {
                    this.resolveList.push(resolve);
                });
                return promise;
            }
            return this;
        });
    }
}
exports.default = Message;
Message.ignoreClasses = new Set();
