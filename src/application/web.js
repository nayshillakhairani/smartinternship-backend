import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "../utils/pathStorage.js";
import { connectToDatabase } from "./database.js";
import router from "../routes/index.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

dotenv.config();
connectToDatabase();
const [pathStorage, pathTemplate, pathCmsBeranda, pathCmsArtikel, pathImage] = path();
export const web = express();
web.use(cors());
web.use(morgan("dev"));
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use("/document", express.static(pathStorage));
web.use("/template", express.static(pathTemplate));
web.use("/image", express.static(pathImage));
web.use("/cms/beranda", express.static(pathCmsBeranda));
web.use("/cms/artikel", express.static(pathCmsArtikel));

web.use(router);

web.use(errorMiddleware);
