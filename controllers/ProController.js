import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

export const getAllProfessionnel = async (req, res) => {
    try {

        const pros = []
        //select id,nom,mail,telephone,Quartier.quartier as nom_quartier,url,image from Professionnel
        
        const allProfessionnel = await prisma.professionnel.findMany({
            include: {
                Quartier: true,
                TypeProfessionnel: true
            }
        })

        if(!allProfessionnel) return res.status(500).json({ messageError: "Erreur de connexion" })
            
        allProfessionnel.forEach(element => {
            pros.push({
                id: element.id,
                nom: element.nom,
                mail: element.mail,
                telephone: element.telephone,
                quartier: element.Quartier.quartier,
                profession: element.TypeProfessionnel.type,
                url: element.url,
                image: element.image
            })
        })

        res.status(200).send(utilisateurs)

    } catch (error) {
        console.log(error);
        res.status(500).send({ errorMessage: "Internal server error" })

    }
}