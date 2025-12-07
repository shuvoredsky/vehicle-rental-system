import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

// const createUser = async (req: Request, res: Response) => {
//     // const { name, email, password } = req.body;

//     try {
//        const result = await userService.createUser(req.body)

//         return res.status(201).json({
//             success: true,
//             message: "User created successfully",
//             data: result.rows[0],
//         });

//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: "User creation failed",
//             error: error.message,
//         });
//     }
// }

const getUser = async(req: Request, res: Response)=>{
    try{
        const result = await userService.getUser()

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        })

    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getSingleUser = async(req:Request, res:Response)=>{
 try{
    const result = await userService.getSingleUser(req.params.id as string)
        if(result.rows.length === 0){
            res.status(404).json({
                 success: false,
            message: "User not found",
            })
        }else{
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: result.rows[0],

            })
        }
        
 }catch(err: any){
     res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })  
 }
}

const updateUser = async(req:Request, res:Response)=>{
 try{
    const userId = req.params.userId as string;
    const currentUser = req.user!;
    console.log({currentUser, targetUserId: userId});

    if(currentUser.role === "customer" && currentUser.userId !== parseInt(userId)){
        return res.status(403).json({
            success: false,
            message: "forbidden"
        })
    }

    const updateData = req.body

    if(currentUser.role === "customer" && updateData.role){
        return res.status(403).json({
            success: false,
            message: "forbidden"
        })
    }


    const result = await userService.updateUser(req.params.userId as string, updateData)
        if(result.rows.length === 0){
            res.status(404).json({
                 success: false,
            message: "User not found",
            })
        }else{
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result.rows[0],

            })
        }
        
 }catch(err: any){
     res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })  
 }
}

const deleteUser = async(req:Request, res:Response)=>{
 try{
    const result = await userService.deleteUser(req.params.userId as string)
        if(result.rowCount === 0){
            res.status(404).json({
                 success: false,
            message: "User not found",
            })
        }else{
            res.status(200).json({
                success: true,
                message: "User delete successfully",
                data: result.rows,

            })
        }
        
 }catch(err: any){
     res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })  
 }
}

export const userController = {
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,
}