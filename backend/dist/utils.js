"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(len) {
    let options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let length = options.length;
    let result = "";
    for (let i = 0; i < len; i++) {
        result += options.charAt(Math.floor(Math.random() * length));
    }
    return result;
}
