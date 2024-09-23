import { Router } from "express";
import { hebdomadaire, journalier, mensuel, restartByZero } from "../controllers/ConsommationController.js";

const router = Router()

router.get('/journalier', journalier)
router.get('/hebdomadaire',hebdomadaire)
router.get('/mensuel',mensuel)
router.get('/restart',restartByZero)

export default router