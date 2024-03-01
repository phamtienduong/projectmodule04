


import { Request, Response } from "express";
import { addCategoriesMySQL, deleteCategoriesMySQL, getCategoriesMySQL, updateCategoriesMySQL } from "../service/category.service";

export const getCategories = async (req:Request,res:Response)=>{
    try {
        const result = await getCategoriesMySQL()
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
    }
}
export const addCategories = async (req:Request,res:Response)=>{
    try {
        const {nameCategory} = req.body
        const result = await addCategoriesMySQL(nameCategory)
        res.status(201).json({
            message:"Thêm category thành công",
            result
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCategories = async (req:Request,res:Response)=>{
    try {
        const {id}=req.params;
        const {nameCategory} = req.body
        const result = await updateCategoriesMySQL(Number(id),nameCategory)
        res.status(201).json({
            message:"Sửa sản phẩm thành công",
            result
        })
    } catch (error) {
        console.log(error);
    }
}
export const deleteCategories = async (req:Request,res:Response)=>{
    try {
        const {id}=req.params;
        const result = await deleteCategoriesMySQL(Number(id))
        res.status(201).json({
            message:"Xoá Category thành công",
            result
        })
    } catch (error) {
        console.log(error);
    }
}