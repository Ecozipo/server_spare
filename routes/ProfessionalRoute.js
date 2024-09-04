import { Router } from "express"
import { getAllProfessionnel } from "../controllers/ProController.js"


const router = Router()
router.get('/all', getAllProfessionnel)

export default router