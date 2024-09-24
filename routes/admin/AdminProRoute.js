import { Router } from "express"
import { addProfessionnal } from "../../controllers/admin/ProController.js"

const router = Router()

router.post('/create', addProfessionnal)

export default router