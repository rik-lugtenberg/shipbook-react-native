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
// https://github.com/react-native-device-info/react-native-device-info#getuniqueid
const uuid_1 = require("uuid");
const react_native_1 = require("react-native");
const platform_1 = require("../platform");
const storage_1 = require("../storage");
const UUID = 'uuid';
class Login {
    constructor(appId, appKey) {
        this.bundleIdentifier = '';
        this.appName = '';
        this.udid = '';
        this.os = react_native_1.Platform.OS;
        this.platform = 'react-native';
        this.osVersion = String(react_native_1.Platform.Version);
        this.appVersion = '';
        this.appBuild = '';
        this.sdkVersion = '0.1.0';
        // sdkBuild: string = '';
        this.manufacturer = platform_1.default.manufacturer;
        this.deviceName = '';
        this.deviceModel = platform_1.default.model;
        this.appId = appId;
        this.appKey = appKey;
        this.time = new Date();
        this.deviceTime = this.time;
        this.language = react_native_1.Platform.OS === 'ios'
            ? react_native_1.NativeModules.SettingsManager.settings.AppleLocale ||
                react_native_1.NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
            : react_native_1.NativeModules.I18nManager.localeIdentifier;
    }
    getObj() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.udid.length === 0) {
                const uuid = yield storage_1.default.getItem(UUID);
                if (uuid)
                    this.udid = uuid;
                else {
                    this.udid = (0, uuid_1.v4)();
                    yield storage_1.default.setItem(UUID, this.udid);
                }
            }
            return this;
        });
    }
}
exports.default = Login;
