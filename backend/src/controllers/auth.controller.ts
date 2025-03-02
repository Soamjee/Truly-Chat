import { Request, RequestHandler, Response } from 'express'
import { User } from '../models/user.model'
import { logIn, signUp } from '../lib/zodAuth'
import bcrypt from "bcryptjs";
import { jwtTokenGenerate } from '../lib/utils';
import { DecodeValue } from '../middleware/auth.middleware';
import cloudinary from '../lib/cloudinary';

export const SignUp = async (req: Request, res: Response) => {
    const signInDetails = req.body
    const zodSuccess = signUp.safeParse(signInDetails)

    if (!zodSuccess.success) {
        res.status(400).json({
            message: "Invalid nature of Input"
        })
        return;
    }

    const duplicate_user = await User.findOne({
        email: signInDetails.email
    })

    if (duplicate_user) {
        res.status(409).json({
            message: "USER_DUPLICATED"
        })
        return;
    }

    const hash = bcrypt.hashSync(signInDetails.password, 10)

    const createdUser = await User.create({
        email: signInDetails.email,
        password: hash,
        fullName: signInDetails.fullName,
        profilePic: signInDetails.profilePic,

    })

    const token = jwtTokenGenerate(createdUser._id, res)

    res.status(201).json({
        message: "USER_CREATED successfully",
        token: token,
        details: {
            createdUser
        }
    })
}

export const Login = async (req: Request, res: Response) => {
    const logInDetails = req.body
    const zodSuccess = logIn.safeParse(logInDetails)

    if (!zodSuccess.success) {
        res.status(400).json({
            message: "Invalid nature of Input"
        })
        return;
    }

    const loggedUser = await User.findOne({
        email: logInDetails.email
    })

    if (!loggedUser) {
        res.status(404).json({
            message: "USER_NOT_FOUND"
        })
        return;
    }

    const isPassword = await bcrypt.compare(logInDetails.password, loggedUser.password)

    if (!isPassword) {
        res.status(401).json({
            message: "USER_UNAUTHORIZED"
        })
        return;
    }

    const token = jwtTokenGenerate(loggedUser._id, res)

    res.status(200).json({
        message: "USER_FOUND",
        token: token,
        details: {
            loggedUser
        }
    })
}

export const Logout = async (req: Request, res: Response) => {
    try {
        res.cookie("cookies", "", { maxAge: 0 })
        res.status(200).json({
            message: "USER_LOGGED_OUT"
        })
    } catch (e) {
        res.status(500).json({
            message: "INTERNAL_SERVER_ERROR"
        })
    }
}

export const UpdateProfile : RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = (req as DecodeValue).decodedValue
        const { new_profile_pic } = req.body
        const userFound = await User.findById(id).select('-password') // dont want to send the password to client

        if (!userFound) {
            res.status(404).json({
                message: "USER_NOT_FOUND"
            })
            return;
        }

        const update_profile_pic = await cloudinary.uploader.upload(new_profile_pic)

        const profilePicUpdate = await User.findByIdAndUpdate(id, { profilePic: update_profile_pic.secure_url }, { new: true })

        if (!profilePicUpdate) {
            res.status(503).json({
                message: "SERVICE_UNAVAILABLE"
            })
        }
        res.status(200).json({
            profilePicUpdate: profilePicUpdate
        })
    } catch (err) {
        console.error("Error in UpdateProfile:", err);
        res.status(500).json({ message: "SERVER_ERROR", error: err });
        return ;
    }

}

export const CheckUser = async (req: Request, res: Response) => {
    const id = (req as DecodeValue).decodedValue
    const user = await User.findById(id).select('-password')
    try {
        res.status(200).json({
            message: "USER_AUTHENTICATED",
            user
        })
    } catch (err) {
        res.status(500).json({
            message: "INTERNAL_SERVER_DOWN"
        })
    }
}