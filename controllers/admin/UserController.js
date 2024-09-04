import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()


export const modifUser = async (req, res) => {
    const { id } = req.body
    try {
        const utilisateur = await prisma.utilisateur.update({
            where: { id: parseInt(id) },
            data: {
                nom: req.body.nom,
                mail: req.body.mail,
                password: req.body.password
            }
        })
        res.status(200).send({ utilisateur })
    } catch (error) {
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.body
    try {
        const utilisateur = await prisma.utilisateur.delete({
            where: { id: parseInt(id) }
        })
        res.status(200).send({ utilisateur })
    } catch (error) {
        res.status(500).send({ errorMessage: "Internal server error" })
    }
} 