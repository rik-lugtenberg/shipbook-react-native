"use strict";
// import { ErrorUtils } from 'react-native';
Object.defineProperty(exports, "__esModule", { value: true });
const inner_log_1 = require("./inner-log");
const log_manager_1 = require("./log-manager");
const exception_1 = require("./models/exception");
class ExceptionManager {
    constructor() {
        this.started = false;
    }
    start() {
        inner_log_1.default.i('starting exception manager');
        this.createException();
    }
    createException() {
        if (this.started)
            return;
        const defaultErrorHandler = ErrorUtils.getGlobalHandler();
        ErrorUtils.setGlobalHandler((error, isFatal) => {
            inner_log_1.default.i(`exception error isFatal("${isFatal}"") name(${error.name}) message("${error.message}"), \nstack - ${error.stack}`);
            let exception = new exception_1.default(error.name, error.message, error.stack);
            log_manager_1.default.push(exception);
            defaultErrorHandler(error, isFatal);
        });
        this.started = true;
    }
}
exports.default = new ExceptionManager();
