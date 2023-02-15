"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_appender_1 = require("./console-appender");
const sbcloud_appender_1 = require("./sbcloud-appender");
class AppenderFactory {
    create(type, name, config) {
        switch (type) {
            case 'ConsoleAppender': return new console_appender_1.default(name, config);
            case 'SBCloudAppender': return new sbcloud_appender_1.default(name, config);
            default: throw new Error('Didn\'t have this appender');
        }
    }
}
exports.default = new AppenderFactory();
