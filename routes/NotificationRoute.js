
import { Router } from "express";
import { createNotification, getNotification,getAllNotifications } from "../controllers/NotificationController.js";

const router = Router()

router.get('/get', getNotification)
router.post('/create', createNotification)
router.get('/getAll', getAllNotifications)

export default router