import { Router } from "express";

import { uploadData,upload } from "../controllers/uploadData.js";
import { getProducts } from "../controllers/getData.js";
import { searchProduct } from "../controllers/searchData.js";

const dataRouter = Router();
dataRouter.post("/upload", upload.single("file"), uploadData);
dataRouter.route("/products").get(getProducts)
dataRouter.route("/products/search").get(searchProduct)
export { dataRouter }