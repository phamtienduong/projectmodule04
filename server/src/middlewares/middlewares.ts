import { NextFunction, Request, Response } from "express";
import { getUserByEmail } from "../service/auth.service";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const checkEmailExist = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const checkEmail = await getUserByEmail(email);
    if (checkEmail) {
        return res.status(401).json({ message: "Email đã được đăng ký" });
    }
    next();
};

export const checkEmpty = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({
            message: 'Vui lòng nhập đủ thông tin'
        });
    }
    next();
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        // token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy token" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        
        if (!decodedToken) {
            return res.status(403).json({ message: "Token không hợp lệ" });
        }

        // Nếu token hop le
        if (decodedToken.role !== 1) {
            return res
                .status(403)
                .json({ message: "Bạn không được cấp quyền để thực hiện việc này!" });
        }

        next();
    } catch (error) {
        console.log(error);
    }
};
