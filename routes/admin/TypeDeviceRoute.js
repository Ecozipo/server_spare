import { Router } from "express";
import { createTypeDevice, getTypeDevices } from "../../controllers/admin/TypeDeviceController.js";
import multer from "multer";

const upload = multer({ dest: "assets/" });
const router = Router();

router.post("/create", upload.single("image"), createTypeDevice);
router.get("/get", getTypeDevices);

export default router;