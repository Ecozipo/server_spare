import { Router } from "express"
import { addProfessionnal } from "../../controllers/admin/AdminProController.js"

const router = Router()

router.post('/create', addProfessionnal)

export default router