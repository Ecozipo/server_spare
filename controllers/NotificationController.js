import { PrismaClient } from "@prisma/client";
import setNotification from "../tasks/Notifications.js";

const prisma = new PrismaClient()

export const getAllNotifications = (req, res) => {
    const { id } = req.params
    const utilisateur = prisma.utilisateur.findUnique(
        {
            where: { id: parseInt(id) }
        }
    )

    if (!utilisateur) res.status(500).json({ errorMessage: "L'utilisateur n'existe pas" })

    const notifications = prisma.notifications.findMany({ where: { id: parseInt(id) } })

    res.status(200).json(notifications)
}

export const deleteNotification = (req, res) => {
    const { id } = req.params
    const { id_comment } = req.body

    const notif = prisma.notifications.findUnique({ where: { id: parseInt(id_comment) } })
    if (!notif) res.status(500).send({ errorMessage: "Notification introuvable" })

    const deletedNotification = prisma.notifications.delete({ where: { id: parseInt(id_comment) } })
    res.status(200).send({ success: "OK", deleteNotification })
}

export const createNotification = async (req, res) => {
    const { titre, subject } = req.body
    try {
        setNotification({ titre, subject })
        res.status(200).json({ message: "Notification créée" })
    } catch (error) {
        res.status(500).json({ errorMessage: "Erreur de connexion" })
    }
}

export const getNotification = (req, res) => {

}