import { PrismaClient } from "@prisma/client"
import { getPercent } from "../data/State.js"
import { getHours } from "../data/State.js"


const prisma = new PrismaClient()

export const getStats = async (req, res) => {
    res.status(200).json(await getPercent())
}

export const getHours = async (req, res) => {
  res.status(200).json(await getHours())
}