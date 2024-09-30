import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export const getAllFournisseurs = async (req, res) => {
    try {

        const data = []
        //select id,nom,telephone,Quartier.quartier as nom_quartier,url,image from Fournisseur
        
        const allFournisseurs = await prisma.fournisseur.findMany({
            include: {
                Quartier: true
            }
        })

        allFournisseurs.forEach(element => {
            data.push({
                id: element.id,
                nom: element.nom,
                telephone: element.telephone,
                quartier: element.Quartier.quartier,
                url: element.url,
                image: element.image,
                devise: element.Quartier.description
            })
        })

        res.status(200).send(data)

    } catch (error) {
        console.log(error)
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}