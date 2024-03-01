
import { Request, Response } from "express";
import {
  addProductMySQL,
  deleteProductMySQL,
  getAllProductMySQL,
  getProductByCategoryIdMySQL,
  getProductByIdMySQL,
  getProductsByName,
  updateOutStockProductMySQL,
  updateProductMySQL,
} from "../service/products.service";

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const result = await getAllProductMySQL();
    res.status(200).json({
      message: "Lấy thành công",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getProductById = async (req: Request, res: Response) => {

  try {
    const { id } = req.params;
    const result = await getProductByIdMySQL(Number(id));
    res.status(200).json({
      message: "Thành công",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { nameProduct, image, price, description, stock, categoryId } =
      req.body;
    const result = await addProductMySQL(
      nameProduct,
      image,
      price,
      description,
      stock,
      categoryId
    );
    if (!result) {
      res.status(500).json({
        message: "Có lỗi khi thêm sản phẩm",
      });
    } else {
      res.status(201).json({
        message: "Thêm sản phẩm thành công",
        result,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nameProduct, image, price, description, stock, categoryId } =
      req.body;
    const result = await updateProductMySQL(
      nameProduct,
      image,
      price,
      description,
      stock,
      categoryId,
      Number(id)
    );
    res.status(200).json({
      message: "Cập nhập thành công",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const  result = await deleteProductMySQL(Number(id));
    res.status(200).json({
      message:"Xoá thành công" ,
      data :result
      })
  } catch (error) {
    console.log(error);
  }
};
export const getProductByCategoryId = async (req:Request,res:Response)=>{
  try {
    const {id} = req.params
    const products=await getProductByCategoryIdMySQL(Number(id))
    res.status(200).json({
      message: 'Lấy dữ liệu thành công',
      products
    })
  } catch (error) {
    console.log(error);
    
  }

}

export async function updateOutStockProduct(req:Request,res:Response) {
  try {
    const { id } = req.params;
    const result = await updateOutStockProductMySQL(Number(id));
    res.status(200).json({
      message: "Cập nhật trạng thái hết hàng thành công",
      result,
    });
  } catch (error) {
    console.log(error);
  }
}
export async function getProductsBySearch(req:Request,res:Response) {
  const {nameProduct} = req.query
try {
  const result = await getProductsByName(String(nameProduct))
  res.status(200).json(result)
} catch (error) {
  console.log(error);
}
}
