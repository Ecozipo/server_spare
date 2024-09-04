import { Router } from "express";
import { achat, getTransactionHistory } from "../../controllers/store/StoreController.js";

const router = Router()

router.post('/achat', achat)
router.post('/transaction', getTransactionHistory)

export default router