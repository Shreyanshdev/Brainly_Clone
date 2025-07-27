import {model , Schema} from 'mongoose';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI! )

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export const UserModel = model( "User" , UserSchema);

const ContentSchema = new Schema({
    title: String,
    link:String,
    tags: [{type:mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type:String
});

const LinkSchema = new Schema({
    hash:String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true , unique: true},
});

const TagSchema = new Schema({
    name: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const TagModel = model("Tag", TagSchema);

export const LinkModel = model("Link", LinkSchema);

export const ContentModel = model("Content", ContentSchema);