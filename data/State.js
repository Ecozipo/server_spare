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

export const setPower = (power) => {
    data.POWER = JSON.stringify(power)
}

export const setData = (id, power) => {
    data.id = id;
    data.POWER = JSON.stringify(power)
    return data;
}

export const saveValue = async (value) => {
    const { power } = value
    const now = moment().tz('Indian/Antananarivo').format('HH:mm:ss')
    const temps = now.split(":")

    temps.forEach((element, index) => {
        temps[index] = parseInt(element)
    })

    if (temps[0] === 16 && temps[1] === 55 && temps[2] === 0) {
        try {
            const creation = await prisma.consomation.create({
                data: {
                    valeur: power,
                    date_consommation: new Date()
                }
            })
            console.log({ message: "Enregistrement effectué" })
        } catch (error) {
            console.log({ errorMessage: "Erreur de connexion" })
            console.log(error)
        }
    }
}