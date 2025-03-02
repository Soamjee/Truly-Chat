import { Response } from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import {Types} from 'mongoose'

dotenv.config()

if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined in environment variables");
  }
  

const JWT_KEY = process.env.JWT_KEY

export function jwtTokenGenerate(userId: Types.ObjectId, res: Response) {
    const token = jwt.sign({userId}, JWT_KEY, {
        expiresIn: '7d'
    })

    res.cookie('cookies', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,  // MS or ms
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    })

    return token;
}

