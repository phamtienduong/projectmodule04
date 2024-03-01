import { Express } from 'express';
import { addToCart, changeQuantity, deleteCartPayment, deleteItemCart, getCartbyUserId, getInfoCart } from '../controller/cart.controller';
export const cartRouter = (app:Express)=>{
    app.get("/api/v1/cart",getInfoCart)
    app.get("/api/v1/cart/:id",getCartbyUserId)
    app.post("/api/v1/cart",addToCart)
    app.delete("/api/v1/cart/delete/:id", deleteItemCart)
    app.patch("/api/v1/cart/quantity",changeQuantity);
    app.delete("/api/v1/carts/:userId",deleteCartPayment )
}