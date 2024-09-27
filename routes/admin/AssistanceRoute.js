import { Router } from "express"
import { createAssistance } from "../../controllers/admin/AssistanceController.js"

const router = Router()

router.post('/create', createAssistance)
router.get('/get', getAssistances)

export default router