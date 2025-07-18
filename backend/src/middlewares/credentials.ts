import { Request, Response, NextFunction } from "express";

const allowedOrigins = [
    'http://192.168.68.122:3000',
    'http://localhost:3000',
];

const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
};

export default credentials;
