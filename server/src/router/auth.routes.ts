import { Express } from 'express';
import { login, register } from '../controller/auth.controller';
import { checkEmailExist, checkEmpty } from '../middlewares/middlewares';
export const authRouter = (app:Express)=>{
    app.post("/api/v1/auth/register",checkEmpty,checkEmailExist, register)
    app.post("/api/v1/auth/login",checkEmpty,login)

}