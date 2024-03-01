import { Request, Response } from "express";
import { adminAcceptMySql, adminDenyMySql, creatBillMySql, getAllIdBill, getBillsForAdminMySql, getBillsForUserMySql, getBillsMySql, userDenyMySql } from "../service/bill.service";


export const getBillsForAdmin = async (req: Request, res: Response) => {
    try {
        const billsId:any = await getAllIdBill();
        // console.log(billsId);
        let data: any[] = [];
        for (let i = 0; i < billsId.length; i++) {
            const result = await getBillsForAdminMySql(billsId[i].bilId);
            data.push(result);
        }

        return res.status(200).json({
            data: data,
            message: "Bạn là admin"
        });
    } catch (error) {
        console.log(error);
    }
}
export const getBillsForUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const result = await getBillsForUserMySql(Number(id));

        return res.status(200).json({
            data: result,
            message: "Bạn là user"
        });
    } catch (error) {
        console.log(error);
    }
}
export const creatBill = async (req: Request, res: Response) => {
    const { userId, phone, address, total } = req.body;
    console.log("sssss",  userId, phone, address, total);
    
    
    try {
        const newIdBill = await creatBillMySql(userId, phone, address, total);
        console.log("===> newBill: ",newIdBill);
        

        res.status(201).json({
            newIdBill
        });
    } catch (error) {
        console.log(error);
    }
}
export const getBills = async (req: Request, res: Response) => {
    try {
        const billsId:any = await getAllIdBill();

        let data: any[] = [];
        for (let i = 0; i < billsId.length; i++) {
            const result = await getBillsMySql(billsId[i].bilId);
            data.push(result);
        }

        return res.status(200).json({
            data: data,
            message: "Bạn là user"
        });
    } catch (error) {
        console.log(error);
    }
}
export const adminDeny = async (req: Request, res: Response) => {
    const { bilId } = req.body;
    try {
        const result = await adminDenyMySql(bilId);
        res.status(200).json({
            result,
            message: "Admin"
        });
    } catch (error) {
        console.log(error);
    }
}
export const userDeny = async (req: Request, res: Response) => {
    const { bilId } = req.body;
    try {
        const result = await userDenyMySql(bilId);
        res.status(200).json({
            result,
            message: "User"
        });
    } catch (error) {
        console.log(error);
    }
}
export const adminAccept = async (req: Request, res: Response) => {
    const { bilId } = req.body
    try {
        const result = await adminAcceptMySql(bilId)
        res.status(200).json({
            result,
            message: "Admin"
        })
    } catch (error) {
        console.log(error)
    }
}
