import { Router } from "express"
import { createAssistance, getAssistances } from "../../controllers/admin/AssistanceController.js"

const router = Router()

router.post('/create', createAssistance)
router.get('/get', getAssistances)

export default router