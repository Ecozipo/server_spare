
import { Router } from "express";
import { createNotification, getNotification } from "../controllers/NotificationController.js";

const router = Router()

router.get('/get', getNotification)
router.post('/create', createNotification)

export default router