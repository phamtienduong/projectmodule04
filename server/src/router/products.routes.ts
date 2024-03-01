import { Express } from 'express';
import { addProduct, deleteProduct, getAllProduct, getProductByCategoryId, getProductById, getProductsBySearch, updateOutStockProduct, updateProduct } from '../controller/products.controller';
export const productRouter = (app:Express)=>{
    app.get("/api/v1/products",getAllProduct)
    app.get("/api/v1/products/search",getProductsBySearch)
    app.get("/api/v1/products/:id",getProductById)
    app.get("/api/v1/products/category/:id",getProductByCategoryId)
    app.post("/api/v1/products",addProduct)
    app.put("/api/v1/products/:id",updateProduct)
    app.patch("/api/v1/products/:id",updateOutStockProduct)
    app.delete("/api/v1/products/:id",deleteProduct)
}
