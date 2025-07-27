import express from 'express';
const app = express(); 
import {z} from 'zod';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { ContentModel, LinkModel, UserModel } from './db';
import { userMiddleware } from './middleware';
import { random } from './utils';
import cors from 'cors';

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));


app.post('/api/v1/signup' , async(req, res) => {
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    //check if user already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    

    //Zod validation
    const userSchema = z.object({
        username: z.string().min(3, 'Username must be at least 3 characters long'),
        password: z.string().min(6, 'Password must be at least 6 characters long')
    });

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        await UserModel.create({ 
            username:username,
            password:hashedPassword 
        })
    
        res.status(201).json({ message: 'User created successfully' });
    }

    catch(error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });  
    }

})

app.post('/api/v1/signin' ,async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try{
        const existingUser=await UserModel.findOne({
            username
        })
        if (!existingUser) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }else{
            const comparePassword = await bcrypt.compare(password,existingUser.password);
            if (!comparePassword) {
                return res.status(400).json({ error: 'Invalid username or password' });
            }
    
            const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            res.json({
                message: 'Login successful',
                token: token,
                userId: existingUser._id
            })
        }
    }
    catch(error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/api/v1/content' ,userMiddleware ,async (req, res) => {
    const link = req.body.link;
    const title = req.body.title;
    const type = req.body.type;

    await ContentModel.create({
        link: link,
        title: title,
        //@ts-ignore
        userId: req.userId,
        tags:[],
        type:type
    })
    res.json({
        message: 'Content created successfully',
        content: {
            link: link,
            title: title,
            //@ts-ignore
            userId: req.userId,
            tags:[],
            type:type
        }
    })
})

app.get('/api/v1/content' ,userMiddleware, async(req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content =await ContentModel.find({userId:userId}).populate('userId' , 'username')
    res.json({
        message: 'Content fetched successfully',
        content: content
    })

})

app.delete('/api/v1/content' ,userMiddleware,async (req, res) => {
    const contentId = req.body.contentId;
    
    await ContentModel.findByIdAndDelete({
        contentId,
        //@ts-ignore
        userId: req.userId
    });
    res.json({
        message: 'Content deleted successfully'
    })
    
})

app.post('/api/v1/brain/share' ,userMiddleware, async (req, res) => {
    const { share } = req.body.share;

    if (share) {
        const existingLink = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (existingLink) {
            return res.status(400).json({ hash: existingLink.hash });
        }

        const hash = random(10);
        await LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        })
        return res.json({
            message: 'Share link created successfully',
            shareLink:  + hash
        });
    }else{
        await LinkModel.deleteMany({
            //@ts-ignore
            userId: req.userId
        });
    }

    res.json({
        message: 'Share status updated successfully',
        share: share
    }) 
    
})

app.get('/api/v1/brain/:shareLink' , async(req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({ hash: hash })

    if(!link){
        return res.status(404).json({ error: 'Share link not found' });
    }

    const content = await ContentModel.find({ userId: link.userId }).populate('userId', 'username');
    const user = await UserModel.findById(link.userId);

    res.json({
        message: 'Content fetched successfully',
        content: content,
        username: user?.username,
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})