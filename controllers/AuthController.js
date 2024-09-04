import bcrypt from "bcrypt"
import validator from "validator"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();


const prisma = new PrismaClient()
const SECRET_KEY = process.env.SECRET_KEY


export const registerUser = async (req, res) => {

    try {

        console.log(req.body);

        const { nom, mail, password, quartier } = req.body


        if (!mail | !nom | !password | !quartier) return res.status(500).send({ errorMessage: "champs non remplies" })
        if (!validator.isEmail(mail)) return res.status(500).send({ errorMessage: "Mail invalide" })

        let user = await prisma.utilisateur.findFirst({ where: { mail } })

        if (user) res.status(500).send({ errorMessage: "L'utilisateur existe déjà" })
        let mdp = await bcrypt.hash(password, 12)

        console.log(nom, mail, { password: mdp }, quartier);


        const register = await prisma.utilisateur.create({
            data: {
                nom: nom.toString(),
                mail: mail.toString(),
                password: mdp.toString(),
                quartier: parseInt(quartier)
            }
        })

        res.status(200).send({ new_user: register })
    } catch (error) {
        console.log(error);
        res.status(500).send({ errorMessage: "Internal server error" })
    }

}

export const loginUser = async (req, res) => {

    try {

        const { profile, password } = req.body

        if (!profile | !password) {
            res.status(500).send({ errorMessage: "Tous les champs sont obligatoires" })
        }

        let utilisateur = (!validator.isEmail(profile)) ?
            await prisma.utilisateur.findFirst({
                where: {
                    nom: profile.toString()
                }
            }) :
            await prisma.utilisateur.findFirst({
                where: {
                    mail: profile.toString()
                }
            })
        console.log(utilisateur);
        const token = jwt.sign({
            utilisateur: utilisateur.id,
            mail: utilisateur.mail
        }, SECRET_KEY);


        res.status(200).send({ token, utilisateur })

    } catch (error) {
        console.log(error);
        res.status(500).send({ errorMessage: "Internal error" })
    }

}

export const logoutUser = async (req, res) => {

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