import { Express } from 'express';
import { verifyToken } from '../middlewares/middlewares';
import { changeStatusUser, getAllUsers } from '../controller/users.contoller';
export const usersRouter = (app:Express)=>{
    app.get('/api/v1/users',verifyToken,getAllUsers)
    app.patch('/api/v1/users/status/:id',verifyToken,changeStatusUser)
}