import { Router } from "express";
import { calculer } from "../controllers/AbonnementController.js";
import { PrismaClient } from "@prisma/client";

const router = Router()
const prisma = new PrismaClient()

router.post("/calculer",calculer)
router.get("/calculer",async (req,res)=>{
    const calcul = await prisma.calculAb.findMany({
        orderBy:{
            id: 'desc'
        },
        take: 1
    })

    let {total} = calcul[0]
    
    res.status(200).json(total)
})

export default router
