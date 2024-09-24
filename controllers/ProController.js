import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

export const getAllProfessionnel = async (req, res) => {
    try {

        const utilisateurs = prisma.professionnel.findMany()

        res.status(200).send(utilisateurs)

    } catch (error) {
        console.log(error);
        res.status(500).send({ errorMessage: "Internal server error" })

    }
}