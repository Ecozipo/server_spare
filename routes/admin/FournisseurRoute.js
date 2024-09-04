import { Router } from "express";
import { createFournisseur, modifFournisseur, deleteFournisseur } from "../../controllers/admin/FournisseurController";

const router = Router()

router.post('/create',createFournisseur)
router.post('/modif',modifFournisseur)
router.post('/delete',deleteFournisseur)

export default router