import { PrismaClient } from "@prisma/client";
import moment from "moment-timezone";

const prisma = new PrismaClient()

export const journalier = async (req, res) => {
    const consommations = await prisma.consomation.findMany()
    res.status(200).json(consommations)
}

export const hebdomadaire = async (req, res) => {
    
    const now_week_start = moment().startOf('week').toDate()
    const now_week_end = moment().endOf('week').toDate()

    const consommations = await prisma.consomation.findMany({
        where: {
            date: {
                gte: now_week_start,
                lte: now_week_end
            }
        }
    })

    res.status(200).json(consommations)
    
}

export const mensuel = (req, res) => {

}

export const restartByZero = (req, res) => {

}