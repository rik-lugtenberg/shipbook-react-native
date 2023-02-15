"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const inner_log_1 = require("./inner-log");
class Platform {
    isPortrait() {
        const dim = react_native_1.Dimensions.get('screen');
        return dim.height >= dim.width;
    }
    ;
    get orientation() {
        return this.isPortrait() ? 'portrait' : 'landscape';
    }
    get os() {
        return react_native_1.Platform.OS;
    }
    get model() {
        if (react_native_1.Platform.OS == 'android') {
            const p = react_native_1.Platform;
            return p.constants.Model;
        }
        else
            return '';
    }
    get manufacturer() {
        var _a;
        inner_log_1.default.d(`the platform , ${JSON.stringify(react_native_1.Platform.constants)}`);
        if (react_native_1.Platform.OS == 'android') {
            const p = react_native_1.Platform;
            return (_a = p.constants.Manufacturer) !== null && _a !== void 0 ? _a : 'google';
        }
        else
            return 'apple';
    }
}
exports.default = new Platform();
