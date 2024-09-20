import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await prisma.utilisateur.findMany(
            {

                include: {
                    Quartier: true,
                },

            }
        )

        res.status(200).send({ allUsers })

    } catch (error) {
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.body
    try {
        const utilisateur = await prisma.utilisateur.findUnique({ where: { id: parseInt(id) } })
        if (!utilisateur) {
            res.status(500).send({ errorMessage: "Utilisateur introuvable" })
        }
        res.status(200).send({ utilisateur })
    } catch (error) {
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}