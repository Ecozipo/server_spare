import { Router } from "express";
import { hebdomadaire, journalier, mensuel, restartByZero } from "../controllers/ConsommationController";

const router = Router()

router.get('/journalier/:id', journalier)
router.get('/hebdomadaire/:id',hebdomadaire)
router.get('/mensuel/:id',mensuel)
router.get('/restart/:id',restartByZero)

export default router