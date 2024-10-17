import { PrismaClient } from "@prisma/client"
import { getPercent } from "../data/State.js"


const prisma = new PrismaClient()

export const getStats = async (req, res) => {
    res.status(200).json(await getPercent())
}

export const getHoursStats = async (req, res) => {
    const hours = await prisma.consomation.count()
    res.status(200).json(hours)
}