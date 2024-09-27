import { PrismaClient } from "@prisma/client";
import moment from "moment-timezone"

const prisma = new PrismaClient();


let data = {
    id: 2,
    POWER: '0'
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

export const setPower = (valeur) => {
    const { power, energy } = valeur
    data.POWER = `{power:${power},energy:${energy}}`
}

export const setEnergy = (energy) => {
    data.POWER = `{energy:${energy}}`
}

export const setData = (id, power) => {
    data.id = id;
    data.POWER = JSON.stringify(power)
    return data;
}

export const saveValue = async (value) => {

    const preview_data = await prisma.consomation.findMany(
        {
            orderBy: {
                date_consommation: 'desc'
            },
            take: 1
        }
    )
    
    console.log(value.toString(),JSON.parse(value.toString()))
    const now = moment().tz('Indian/Antananarivo').format('HH:mm:ss')
    const temps = now.split(":")

    temps.forEach((element, index) => {
        temps[index] = parseInt(element)
    })

    if (temps[0] === 0 && temps[1] === 0 && temps[2] === 0) {

        try {
            const creation = await prisma.consomation.create({
                data: {
                    valeur: JSON.stringify(value),
                    date_consommation: new Date()
                }
            })
            console.log({ message: "Enregistrement effectué" , data: creation })
        } catch (error) {
            console.log({ errorMessage: "Erreur de connexion" })
            console.log(error)
        }

    }
}