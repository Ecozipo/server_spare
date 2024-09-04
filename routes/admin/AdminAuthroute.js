import { Router } from "express";
import { loginAdmin, logoutAdmin, registerAdmin } from "../../controllers/admin/AuthController.js";

const router = Router()

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.post('/logout', logoutAdmin)

export default router