import { Router } from "express";
import { getDevices, createDevice, updateDevice, deleteDevice } from "../controllers/deviceController.js";
import multer from "multer";

const upload = multer({ dest: "assets/" });
const router = Router();

router.get("/all", getDevices);
// router.get("/", getDevices);
router.post("/new",upload.single('image'), createDevice);
router.put("/update",upload.single('image'), updateDevice);
router.post("/delete", deleteDevice);

export default router;
