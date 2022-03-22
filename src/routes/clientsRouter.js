import { Router } from "express";
import { postClients } from "../controllers/clientsController.js";

const clientsRouter = Router();
clientsRouter.post("/clients", postClients);

export default clientsRouter;
