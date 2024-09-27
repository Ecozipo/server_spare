import { PrismaClient } from "@prisma/client"
import { getPercent } from "../data/State.js"


const prisma = new PrismaClient()

export const getStats = async (req, res) => {
    res.status(200).json(await getPercent())
}