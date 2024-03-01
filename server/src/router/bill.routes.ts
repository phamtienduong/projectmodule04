import { Express } from 'express';
import { adminAccept, adminDeny, creatBill, getBills, getBillsForAdmin, getBillsForUser, userDeny } from '../controller/bill.controller';
export const billRouter = (app:Express)=>{
    app.get("/api/v1/bills", getBillsForAdmin)
    app.get("/api/v1/bill/:id", getBillsForUser)
    app.post("/api/v1/bill/creatBill",creatBill)
    app.get("/api/v1/bills/:userId",getBills)
    app.patch("/api/v1/bills/admindeny", adminDeny)
    app.patch("/api/v1/bills/userdeny", userDeny)
    app.patch("/api/v1/bills/adminaccept", adminAccept)






}