import { Express } from 'express';
import { authRouter } from './auth.routes';
import { productRouter } from './products.routes';
import { categoryRouter } from './category.routes';
import { cartRouter } from './cart.routes';
import { usersRouter } from './users.routes';
import { billRouter } from './bill.routes';
import { billDetailRouter } from './bill_detail.routes';

export const rootRouter = (app:Express)=>{
  authRouter(app),
  productRouter(app),
  categoryRouter(app),
  cartRouter(app),
  usersRouter(app),
  billRouter(app),
  billDetailRouter(app)
}