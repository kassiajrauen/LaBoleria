import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const server = express();
server.use(json());
server.use(cors());
server.use(router);

server.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
