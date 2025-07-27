import { NextFunction , Request , Response } from "express";
import jwt, { decode } from "jsonwebtoken";


export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    console.log("Header:", header);

    if (!header) {
        return res.status(401).json({ error: "Authorization token missing" });
    }
    try {
        const decoded = jwt.verify(header as string, process.env.JWT_SECRET || "");
        if(!decoded){
            return res.status(403).json({ error: "Invalid token" });
        }
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
