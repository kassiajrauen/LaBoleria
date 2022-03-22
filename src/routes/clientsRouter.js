import { Router } from "express";
import {
  postClients,
  getOrdersByClientId,
} from "../controllers/clientsController.js";

const clientsRouter = Router();
clientsRouter.post("/clients", postClients);
clientsRouter.get("/clients/:id/orders", getOrdersByClientId);

export default clientsRouter;
