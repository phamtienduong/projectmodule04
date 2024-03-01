import { Request, Response } from "express";
import { creatBillDetailMySql, getProductInBillMySql } from "../service/bill_detail.service";


export const creatBillDetail = async (req:Request,res:Response)=>{
    try {
        const { billId, cart } = req.body;
        console.log(req.body);
        
        
        await Promise.all(
            cart.map(async (product:any) => await creatBillDetailMySql(billId, product.productId, product.quantity))
        );
        res.status(200).json({
            message: "Tạo chi tiết bill thành công"
        });
    } catch (error) {
        console.log(error);
    }
    
} 
export const getProductInBill = async(req:Request,res:Response)=>{
    const { billId } = req.params;
    try {
        const products = await getProductInBillMySql(Number(billId));
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
    }
    
} 