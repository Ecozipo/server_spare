import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


let data = {
    id: 2,
    POWER: 0
}

export const getPower = () => {
    return data.POWER;
}

export const getId = () => {
    return data.id;
}

export const setId = (id) => {
    data.id = id
}

export const setPower = (power) => {
    data.POWER = parseInt(power)
}

export const setData = (id, power) => {
    data.id = id;
    data.POWER = parseInt(power);
    return data;
}

export const saveValue = async (value) => {
    const { id, power } = value;

    const utilisateur = await prisma.utilisateur.findUnique({ where: { id: parseInt(id) } })

    if (!utilisateur) {
        console.log({ errorMessage: "Utilisateur introuvable" })
    }

    try {
        const creation = await prisma.consomation.create({
            data: {
                valeur: parseInt(power),
                date_consommation: new Date()
            }
        })
        console.log({ message: "Enregistrement effectué" })
    } catch (error) {
        console.log({ errorMessage: "Erreur de connexion" })
        console.log(error)
    }
}