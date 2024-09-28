import { Router } from "express";
import { payer, getTransactionHistory } from "../../controllers/store/StoreController.js";

const router = Router()

router.post('/payer', payer)
router.post('/transaction', getTransactionHistory)

export default router