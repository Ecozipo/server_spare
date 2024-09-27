import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export const getAllFournisseurs = async (req, res) => {
    try {
        const allFournisseurs = await prisma.fournisseur.findMany({
            select: {
                id: true,
                nom: true,
                telephone: true,
                image: true,
                url: true,
                description: true,
                quartier: {
                    select: {
                        quartier: true
                    },
                },
            }
        })

        res.status(200).send(allFournisseurs)

    } catch (error) {
        console.log(error)
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}