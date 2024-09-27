import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export const getAllFournisseurs = async (req, res) => {
    try {
        //select * from fournisseur join quartier on fournisseur.quartier = quartier.id
        const allFournisseurs = await prisma.fournisseur.findMany({
            include: {
                Quartier: true
            }
        })

        res.status(200).send(allFournisseurs)

    } catch (error) {
        console.log(error)
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}