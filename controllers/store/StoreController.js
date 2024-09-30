import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import moment from "moment-timezone"

const prisma = new PrismaClient()

export const payer = async (req, res) => {

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

export const getInSaleModules = async (req, res) => {
    try {
        const modules = await prisma.module.findMany()
        res.status(200).json(modules)
    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
}

export const buyModule = async (req, res) => {

    const { id,telephone } = req.body

    try {

        const buy = await prisma.achat.create({
            data: {
                utilisateur: parseInt(utilisateur.id),
                module: parseInt(module.id),
                payedAt: moment().tz('Indian/Antananarivo').format('YYYY-MM-DD HH:mm:ss')
            }
        })
        res.status(200).json(buy)
    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
}