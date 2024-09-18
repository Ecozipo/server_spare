import { Router } from "express";
import { createFournisseur, modifFournisseur, deleteFournisseur } from "../../controllers/admin/FournisseurController.js";
import multer from "multer";

const upload = multer({dest: 'assets/'})

const router = Router()

router.post('/create',upload.single('image'),createFournisseur)
router.post('/modif',upload.single('image'),modifFournisseur)
router.post('/delete',deleteFournisseur)

export default router