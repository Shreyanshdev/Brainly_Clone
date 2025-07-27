"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.post('/api/v1/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    //check if user already exists
    const existingUser = await db_1.UserModel.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    //Zod validation
    const userSchema = zod_1.z.object({
        username: zod_1.z.string().min(3, 'Username must be at least 3 characters long'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long')
    });
    //hashing the password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    try {
        await db_1.UserModel.create({
            username: username,
            password: hashedPassword
        });
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/v1/signin', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        const existingUser = await db_1.UserModel.findOne({
            username
        });
        if (!existingUser) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        else {
            const comparePassword = await bcrypt_1.default.compare(password, existingUser.password);
            if (!comparePassword) {
                return res.status(400).json({ error: 'Invalid username or password' });
            }
            const token = jsonwebtoken_1.default.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({
                message: 'Login successful',
                token: token,
                userId: existingUser._id
            });
        }
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/v1/content', middleware_1.userMiddleware, async (req, res) => {
    const link = req.body.link;
    const title = req.body.title;
    const type = req.body.type;
    await db_1.ContentModel.create({
        link: link,
        title: title,
        //@ts-ignore
        userId: req.userId,
        tags: [],
        type: type
    });
    res.json({
        message: 'Content created successfully',
        content: {
            link: link,
            title: title,
            //@ts-ignore
            userId: req.userId,
            tags: [],
            type: type
        }
    });
});
app.get('/api/v1/content', middleware_1.userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await db_1.ContentModel.find({ userId: userId }).populate('userId', 'username');
    res.json({
        message: 'Content fetched successfully',
        content: content
    });
});
app.delete('/api/v1/content', middleware_1.userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    await db_1.ContentModel.findByIdAndDelete({
        contentId,
        //@ts-ignore
        userId: req.userId
    });
    res.json({
        message: 'Content deleted successfully'
    });
});
app.post('/api/v1/brain/share', middleware_1.userMiddleware, async (req, res) => {
    const { share } = req.body.share;
    if (share) {
        const existingLink = await db_1.LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (existingLink) {
            return res.status(400).json({ hash: existingLink.hash });
        }
        const hash = (0, utils_1.random)(10);
        await db_1.LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        });
        return res.json({
            message: 'Share link created successfully',
            shareLink: +hash
        });
    }
    else {
        await db_1.LinkModel.deleteMany({
            //@ts-ignore
            userId: req.userId
        });
    }
    res.json({
        message: 'Share status updated successfully',
        share: share
    });
});
app.get('/api/v1/brain/:shareLink', async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_1.LinkModel.findOne({ hash: hash });
    if (!link) {
        return res.status(404).json({ error: 'Share link not found' });
    }
    const content = await db_1.ContentModel.find({ userId: link.userId }).populate('userId', 'username');
    const user = await db_1.UserModel.findById(link.userId);
    res.json({
        message: 'Content fetched successfully',
        content: content,
        username: user === null || user === void 0 ? void 0 : user.username,
    });
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
