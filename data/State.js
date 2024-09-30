import { PrismaClient } from "@prisma/client";
import moment from "moment-timezone"
import { format_data } from "./functions.js";
import io from "../utils/socketio.js";
import device from "../utils/awsDevice.js";

const socket = io("ws://localhost:5000");
const prisma = new PrismaClient();


let data = {
    id: 2,
    POWER: '0',
    heures : 0
}

export const getPower = () => {
    return data.POWER;
}
export const init_hours = async() => {
    const hours = await prisma.consomation.count()
    data.heures = parseInt(hours)
}

export const setHours = async (heures) => {
    data.heures = heures
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
                date_consommation: new Date(moment().tz('Indian/Antananarivo').toISOString())
            }
        })

        const hours = await prisma.consomation.count()
        console.log({ message: "Enregistrement effectué" , data: creation })

        setHours(parseInt(hours))

        device.emit('hours','hours/active',parseInt(hours))
        socket.emit('hours',parseInt(hours))

    } catch (error) {

        console.log({ errorMessage: "Erreur de connexion" })
        console.log(error)
        
    }
    

}

export const getHours = async () => {
    try{
        return data.heures
    }catch(error){
        console.log(error)
    }
}
// ----------------------------------------------------Pourcentage------------------------------------------------------------//

export const getPercent = async () => {
    try{
        const stats = await prisma.stats.findMany({
            orderBy:{
                date: 'desc'
            },
            take: 1
        })

        return stats[0].percentage

    }catch(error){
        console.log(error)
    }
}

export const setPercent = async (percent) => {
    
    console.log(percent)

    try {
        const setStat = await prisma.stats.create({
            data: {
                percentage: parseFloat(percent),
                date: moment().tz('Indian/Antananarivo').toISOString()
            }
        })
        console.log(setStat)
    
    } catch (error) {
        console.log(error)
    }

}