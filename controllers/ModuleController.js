import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

export const getModules = async (req, res) => {
    const token = req.body.token
    try {
        const id = (await jwt.decode(token)).id
        const utilisateur = await prisma.utilisateur.findUnique({ where: { id: parseInt(id) } })
        if (!utilisateur) {
            res.status(500).send({ errorMessage: "Utilisateur introuvable" })
        }

        const modules = await prisma.module.findMany({ where: { utilisateur: parseInt(id) } })

        res.status(200).send({ modules })

    } catch (error) {
        console.log(error);

        res.status(500).send({ errorMessage: "Internal server error" })
    }
}

export const removeModule = async (req, res) => {
    const token = req.body.token
    try {
        const id = (await jwt.decode(token)).id
        const utilisateur = await prisma.utilisateur.findUnique({ where: { id: parseInt(id) } })
        if (!utilisateur) {
            res.status(500).send({ errorMessage: "Utilisateur introuvable" })
        }

        const module = await prisma.module.findMany({ where: { utilisateur: parseInt(id) } })

        res.status(200).send({ modules })

    } catch (error) {
        console.log(error);

        res.status(500).send({ errorMessage: "Internal server error" })
    }
}

export const modifyModule = async (req, res) => { }