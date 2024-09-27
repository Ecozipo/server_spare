import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export const getAllFournisseurs = async (req, res) => {
    try {
        //select id,nom,telephone,Quartier.quartier as nom_quartier,url,image from Fournisseur
        
        const allFournisseurs = await prisma.fournisseur.findMany({
            select: {
                id: true,
                nom: true,
                telephone: true,
                url: true,
                image: true
            },
            include:{
                Quartier:true
            }
        })

        res.status(200).send(allFournisseurs)

    } catch (error) {
        console.log(error)
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}