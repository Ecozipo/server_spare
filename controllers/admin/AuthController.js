import bcrypt from "bcrypt"
import validator from "validator"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();


const prisma = new PrismaClient()
const SECRET_KEY = process.env.SECRET_KEY


export const loginAdmin = async (req, res) => {

    try {

        const { profile, password } = req.body

        if (!profile | !password) {
            res.status(500).send({ errorMessage: "Tous les champs sont obligatoires" })
        }

        let admin = (!validator.isEmail(profile)) ?
            await prisma.admin.findFirst({
                where: {
                    nom: profile.toString()
                }
            }) :
            await prisma.admin.findFirst({
                where: {
                    email: profile.toString()
                }
            })

        const compareMdp = await bcrypt.compare(password, admin.password)

        if (!compareMdp) res.status(401).send({ errorMessage: "Login ou mot de passe incorrect" })
        console.log(admin, compareMdp);
        const token = jwt.sign({
            admin: admin.id,
            email: admin.email
        }, SECRET_KEY);


        res.status(200).send({ token, admin })

    } catch (error) {
        console.log(error);
        res.status(500).send({ errorMessage: "Internal error" })
    }

}

export const registerAdmin = async (req, res) => {
    const { nom, mail, password } = req.body

    try {
        if (!nom | !mail | !password) return res.status(401).send({ errorMessage: "Champs obligatoirement à remplir" })

        const existingAdmin = await prisma.admin.findFirst(
            {
                where: {
                    email: mail
                }
            }
        )
        console.log(existingAdmin)
        if (existingAdmin) return res.status(401).send({ errorMessage: "Compte déjàa existant" })

        const mpd = (await bcrypt.hash(password, 12)).toString()
        console.log(mpd)
        const register = await prisma.admin.create(
            {
                data: {
                    nom,
                    email: mail,
                    password: mpd
                }
            }
        )
        res.status(200).send({ success: true, account: register })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

}

export const logoutAdmin = async (req, res) => {

    const token = req.headers.authorization.split(" ")[1]

    const usedToken = await prisma.usedToken.create({
        data: {
            token: token
        }
    })

    res.status(200).send({ state: "logout", token })

}


export const verifyToken = async (req, res) => {
    try {

        const token = req.body.token

        const usedToken = await prisma.usedToken.findFirst({ where: { token: token } })
        if (usedToken) return res.status(500).send({ errorMessage: "Token déjà utilisé" })

        const decoded = jwt.verify(token, SECRET_KEY)

        if (!decoded) return res.status(500).send({ errorMessage: "Token invalide" })

        res.status(200).send({ utilisateur: decoded })

    } catch (error) {
        console.log(error);

        res.status(500).send({ errorMessage: "Internal server error" })
    }
}