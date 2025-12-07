import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signup = async(req: Request, res:Response)=>{

    try {
           const result = await authServices.signup(req.body)
           console.log("body from controller", req.body)
    
            return res.status(200).json({
                success: true,
                message: "Register successfully",
                data: result,
            });
    
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Register failed",
                error: error.message,
            });
        }

}

const signin = async (req: Request, res: Response)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        const result = await authServices.signIn(email, password)

        if(!result){
            return res.status(401).json({
                success: false,
                message: "invalid email or password"
            })
        }
    
            return res.status(200).json({
                success: true,
                message: "Login successfully",
                data: {
                    token: result.token,
                    user: result.user,
                },
            });
    
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Login failed",
                error: error.message,
            });
        }
}

export const authController = {
    signup,
    signin,
}