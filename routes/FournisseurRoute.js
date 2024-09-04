import { Router } from "express";
import { getAllFournisseurs } from "../controllers/FournisseurController.js";

const router = Router()

router.get('/all', getAllFournisseurs)

export default router