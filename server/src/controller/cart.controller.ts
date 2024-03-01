import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { addToCartMySQL, changeQuantityMySql, deleteCartByUserId, deleteItemCartMySql, getCartbyUserIdMySQL, getInfoCartMySQL } from "../service/cart.service";

export const getInfoCart = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy token" });
    }
    jwt.verify(token, process.env.JWT_SECRET!, async (err: any, data: any) => {
      if (err) {
        console.log(err);
        if (err.name === "TokenExpiredError") {
          // Nếu token đã hết hạn
          return res.status(401).json({ message: "Token đã hết hạn" });
        } else {
          // Nếu token không hợp lệ
          return res.status(403).json({ message: "Token không hợp lệ" });
        }
      }
      // Nếu token hop le
      if (data.role == 0) {
        // console.log(data);
        const result = await getInfoCartMySQL(data.id);
        // console.log(result);
        return res.status(200).json({
          data: result,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
export const addToCart = async (req: Request, res: Response) => {
  const { productId } = req.body;
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy token" });
    }
    jwt.verify(token, process.env.JWT_SECRET!, async (err: any, data: any) => {
      if (err) {
        console.log(err);
        if (err.name === "TokenExpiredError") {
          // Nếu token đã hết hạn
          return res.status(401).json({ message: "Token đã hết hạn" });
        } else {
          // Nếu token không hợp lệ
          return res.status(403).json({ message: "Token không hợp lệ" });
        }
      }
      // Nếu token hop le
      if (data.role == 0) {
        // console.log(data);
        const result = await addToCartMySQL(data.id, productId);
        if (result != null) {
          return res.status(201).json({
            message: "Thêm vào giỏ hàng thành công",
            data: result,
          });
        } else {
          return res.status(200).json({
            message: "Đã có trong giỏ hàng",
            data: result,
          });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
  };
export const deleteItemCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy token" });
    }
    jwt.verify(token, process.env.JWT_SECRET!, async (err: any, data: any) => {
      if (err) {
        console.log(err);
        if (err.name === "TokenExpiredError") {
          // Nếu token đã hết hạn
          return res.status(401).json({ message: "Token đã hết hạn" });
        } else {
          // Nếu token không hợp lệ
          return res.status(403).json({ message: "Token không hợp lệ" });
        }
      }
      // Nếu token hop le
      if (data.role == 0) {
        // console.log(data);
        const result = await deleteItemCartMySql(data.id, Number(id));
        return res.status(200).json({
          message: "Xoá thành công",
          data: result,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
  };
export const changeQuantity = async (req: Request, res: Response) => {
  const { cartId } = req.body;
  const { type } = req.body;
  console.log(cartId,type);
  

  try {
    const result = await changeQuantityMySql(cartId, type);
    console.log(result);
    res.status(200).json({
      message: "Tăng số lượng thành công",
    });
  } catch (error) {
    console.log(error);
  }
  };
export const deleteCartPayment = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await deleteCartByUserId(Number(userId));
    res.status(200).json({
      message: "Xoá giỏ hàng thành công",
    });
  } catch (error) {
    console.log(error);
  }
  };
export const getCartbyUserId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await getCartbyUserIdMySQL(Number(id))
    res.status(201).json({
      data : result
    })
  };
