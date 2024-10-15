import { Router } from "express";
import { calculer } from "../controllers/AbonnementController.js";
import { getTotal } from "../data/State.js";

const router = Router()

router.post("/calculer",calculer)
router.get("/total",(req,res)=>{
    const total = getTotal()
    res.status(200).send(total)
})