import { PrismaClient } from "@prisma/client";
import setNotification from "../../tasks/Notifications.js";

const prisma = new PrismaClient()

export const getAssistances = async (req, res) => {
    const assistances = await prisma.assistance.findMany()
    res.status(200).json(assistances)
}

export const createAssistance = async (req, res) => {
    const { titre, description } = req.body

    try {
        const assistance = await prisma.assistance.create({
            data: {
                titre,
                description
            }
        })

       Socket.emit('notification',JSON.stringify({titre,subject:description}))

        res.status(200).json(assistance)

    } catch (error) {
        console.log(error)
        res.status(500).json({ messageError: "Erreur de connexion" })
    }
}

