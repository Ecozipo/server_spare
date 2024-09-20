import { Router } from "express";
import { getDevice, getDevices, createDevice, updateDevice, deleteDevice } from "../controllers/deviceController.js";

const router = Router();

router.get("/all/:id", getDevices);
// router.get("/", getDevices);
router.post("/new/:id", createDevice);
router.put("/update/:id", updateDevice);
router.post("/delete/:id", deleteDevice);

export default router;
