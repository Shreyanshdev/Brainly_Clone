"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = exports.LinkModel = exports.TagModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mongoose_2.default.connect(process.env.MONGO_URI);
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
const ContentSchema = new mongoose_1.Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true },
    type: String
});
const LinkSchema = new mongoose_1.Schema({
    hash: String,
    userId: { type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
});
const TagSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    userId: { type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true },
});
exports.TagModel = (0, mongoose_1.model)("Tag", TagSchema);
exports.LinkModel = (0, mongoose_1.model)("Link", LinkSchema);
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
