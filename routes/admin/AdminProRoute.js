import { Router } from "express"
import { addProfessionnal } from "../../controllers/admin/AdminProController.js"
import multer from "multer"

const upload = multer({ dest: 'assets/' })

const router = Router()

router.post('/create',upload.single('image'), addProfessionnal)

export default router