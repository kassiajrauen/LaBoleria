import { Router } from "express";
import { postCakes } from "../controllers/cakesController.js";

const cakesRouter = Router();
cakesRouter.post("/cakes", postCakes);

export default cakesRouter;
