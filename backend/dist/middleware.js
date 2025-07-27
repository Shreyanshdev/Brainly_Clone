"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    console.log("Header:", header);
    if (!header) {
        return res.status(401).json({ error: "Authorization token missing" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(header, process.env.JWT_SECRET || "");
        if (!decoded) {
            return res.status(403).json({ error: "Invalid token" });
        }
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
exports.userMiddleware = userMiddleware;
