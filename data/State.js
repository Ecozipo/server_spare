import { PrismaClient } from "@prisma/client";
import moment from "moment-timezone"
import { format_data } from "./functions.js";

const prisma = new PrismaClient();


let data = {
    id: 2,
    POWER: '0'
}

export const getPower = () => {
    return data.POWER;
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
    
    const actual_value = format_data(JSON.stringify(value))
        
    const now = moment().tz('Indian/Antananarivo').format('HH:mm:ss')
    const temps = now.split(":")

    temps.forEach((element, index) => {
        temps[index] = parseInt(element)
    })
    
    if (temps[0] === 0 && temps[1] === 0 && temps[2] === 0) {

        try {

            const preview = await prisma.consomation.findMany(
                {
                    orderBy: {
                        date_consommation: 'desc'
                    },
                    take: 1
                }
            )
        
            console.log(preview)
        
            preview.forEach(element => {
                element.valeur = format_data(element.valeur)
            })
        
            let p_valeur = preview[0].valeur
        
            // console.log(preview[0], value)

            const creation = await prisma.consomation.create({
                data: {
                    valeur: JSON.stringify(`{power:${p_valeur.power},energy:${actual_value.energy-preview[0].total}}`),
                    total: actual_value.energy,
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

// ----------------------------------------------------Pourcentage------------------------------------------------------------//

let percentage = 0

export const getPercent = () => {
    return percentage
}

export const setPercent = (percent) => {
    percentage = percent
}