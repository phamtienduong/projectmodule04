import { Express } from 'express';
import { addCategories, deleteCategories, getCategories, updateCategories } from '../controller/category.controller';
export const categoryRouter = (app:Express)=>{
    app.get("/api/v1/categories",getCategories)
    app.post("/api/v1/categories",addCategories)
    app.put("/api/v1/categories/:id",updateCategories)
    app.delete("/api/v1/categories/:id",deleteCategories)


}