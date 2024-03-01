import { Request, Response } from "express";
import { changeStatusUserMySQL, getAllUsersMySQL } from "../service/users.service";

export const getAllUsers = async(req:Request,res:Response)=>{
    try {   
        const result = await getAllUsersMySQL()
        res.status(200).json({
            message:"Bạn là admin",
            result
        })
        
    } catch (error) {
        console.log(error);
    }
}
export const changeStatusUser = async(req:Request,res:Response)=>{
    try {   
        const {id}= req.params;
        const { status}= req.body;
        const result = await changeStatusUserMySQL(Number(id),status)
        res.status(200).json({
            message:"Đổi status thành công",
            result
        })  
    } catch (error) {
        console.log(error);
    }
}
