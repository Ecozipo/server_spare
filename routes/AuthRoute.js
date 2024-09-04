import { Router } from "express";
import { loginUser, registerUser, logoutUser, verifyToken } from "../controllers/AuthController.js";


const router = Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/verifyToken', verifyToken)
router.post('/logout', logoutUser)


export default router