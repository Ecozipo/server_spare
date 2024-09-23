import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const journalier = async (req, res) => {
    const consommations = await prisma.consomation.findMany()
    res.status(200).json(consommations)
}

export const hebdomadaire = (req, res) => {

}

export const mensuel = (req, res) => {

}

export const restartByZero = (req, res) => {

}