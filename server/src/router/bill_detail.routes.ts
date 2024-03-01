import { Express } from 'express';
import { creatBillDetail, getProductInBill } from '../controller/bill_detail.controller';
export const billDetailRouter = (app:Express)=>{
    app.post("/api/v1/billDetail",creatBillDetail)
    app.get("/api/v1/billDetail/:billId", getProductInBill)
}