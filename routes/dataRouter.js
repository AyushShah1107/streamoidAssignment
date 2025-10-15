import { Router } from "express";

import { uploadData,upload } from "../controllers/uploadData.js";

const dataRouter = Router();
dataRouter.post("/uploadData", upload.single("file"), uploadData);

export { dataRouter }