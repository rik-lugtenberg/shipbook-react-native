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
const base_log_1 = require("../models/base-log");
class ConsoleAppender {
    constructor(name, config) {
        this.name = name;
        this.update(config);
    }
    update(config) {
        this.pattern = config === null || config === void 0 ? void 0 : config.pattern;
    }
    push(log) {
        return __awaiter(this, void 0, void 0, function* () {
            if (log.type == base_log_1.LogType.Message) {
                const message = yield log.getObj();
                const text = `${message.fileName} ${message.lineNumber} ${message.message}`;
                switch (message.severity) {
                    // case Severity.Error:
                    //   console.error(text);
                    //   break;
                    // case Severity.Warning:
                    //   console.warn(text);
                    //   break;
                    // case Severity.Info:
                    //   console.info(text);
                    //   break;
                    // case Severity.Debug:
                    //   console.debug(text);
                    //   break;
                    default:
                        console.log(`${message.severity} - ${text}`);
                }
            }
        });
    }
    flush() {
    }
    destructor() {
    }
}
exports.default = ConsoleAppender;
