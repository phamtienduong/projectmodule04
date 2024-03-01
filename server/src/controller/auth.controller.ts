import argon from "argon2";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { addUser, getUserByEmail } from "../service/auth.service";

async function register(req: Request, res: Response): Promise<any> {
  try {
    const { userName, email, phone, password } = req.body;
    const hashedPassword = await argon.hash(password);
    const result = await addUser(userName, email, phone, hashedPassword);
    if (!result) {
      return res.status(500).json({
        message: "Server lỗi",
      });
    }
    res.status(201).json({
      message: "Đăng ký thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server lỗi",
    });
  }
}

async function login(req: Request, res: Response): Promise<any> {
  try {
    const { email, password } = req.body;
    const result = await getUserByEmail(email);
    if (!result) {
      return res.status(404).json({
        message: "Email không tồn tại",
      });
    }
    if (result.status === 1) {
      return res.status(400).json({ message: "Tài khoản bị khoá" });
    }

    const checkPassword = await argon.verify(result.password, password);

    if (checkPassword) {
      const token = jwt.sign(
        { id: result.userId, role: result.role },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "10h",
        }
      );

      if (token) {
        return res.status(200).json({
          message: "Đăng nhập thành công",
          token,
          result,
        });
      }
    } else {
      console.log("==>", checkPassword);
      res.status(400).json({
        message: "Sai mật khẩu",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server lỗi",
    });
  }
}

export { register, login };
