import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Response, Request, RequestHandler } from 'express'

dotenv.config()

if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined in environment variables')
}
const JWT_KEY = process.env.JWT_KEY

export interface DecodeValue extends Request {
    
    decodedValue: string
}

export const authenticatedRoute : RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.cookies

        if (!token) {
            res.status(401).json({
                message: "USER_UNAUTHORIZED"
            })
            return;
        }

        const decodedValue = jwt.verify(token, JWT_KEY) as JwtPayload

        if (!decodedValue) {
            res.status(401).json({
                message: "USER_UNAUTHORIZED"
            })
            return;
        }
        (req as DecodeValue).decodedValue = decodedValue.userId 
        next()
        
    }catch(err){
        res.status(500).json({
            "message" : "INTERNAL_SERVER_ERROR"
        })
        console.log(err)
    }
}