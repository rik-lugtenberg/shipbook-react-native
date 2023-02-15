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
exports.HttpMethod = void 0;
const session_manager_1 = require("./session-manager");
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["PUT"] = "PUT";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
class ConnectionClient {
    constructor() {
        this.BASE_URL = "https://api.shipbook.io/v1/";
    }
    request(url, body, method) {
        return __awaiter(this, void 0, void 0, function* () {
            let headers = new Headers({
                'Content-Type': 'application/json'
            });
            if (session_manager_1.default.token)
                headers.set('Authorization', `Bearer ${session_manager_1.default.token}`);
            let init = { headers };
            if (body)
                init.body = JSON.stringify(body);
            if (method)
                init.method = method;
            let resp = yield fetch(this.BASE_URL + url, init);
            if (!resp.ok && resp.status === 401 && resp.statusText === 'TokenExpired') { // call refresh token
                if (!(yield session_manager_1.default.refreshToken()))
                    return resp;
                resp = yield this.request(url, body, method);
            }
            return resp;
        });
    }
}
exports.default = new ConnectionClient();
