import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const achat = async (req, res) => {

    const cart = req.body.cart
    let prix = 0
    cart.forEach((item) => {
        prix += item.prix
    })
}

export const getTransactionHistory = async (req, res) => {
    const token = req.body.token
    try {
        const utilisateur = (await jwt.decode(token)).utilisateur
        const buyHistory = await prisma.achat.findMany({
            where: {
                utilisateur: parseInt(utilisateur.id)
            }
        })
        res.status(200).json(buyHistory)
    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
}