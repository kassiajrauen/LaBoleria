import { Router } from "express";
import {
  postOrder,
  getOrders,
  getOrdersId,
} from "../controllers/ordersController.js";

const ordersRouter = Router();
ordersRouter.post("/order", postOrder);
ordersRouter.get("/orders", getOrders);
ordersRouter.get("/orders/:id", getOrdersId);

export default ordersRouter;
