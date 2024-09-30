import { Router } from "express";
import { hebdomadaire, journalier, mensuel, restartByZero } from "../controllers/ConsommationController.js";

const router = Router()

router.get('/day', journalier)
router.get('/week',hebdomadaire)
router.get('/month',mensuel)
router.get('/restart',restartByZero)

export default router