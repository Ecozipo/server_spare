import { PrismaClient } from "@prisma/client";
import { io } from "socket.io-client";
import moment from "moment-timezone";
import { format_data } from "../data/functions.js";

const prisma = new PrismaClient()
const socket = io("ws://localhost:5000")

export const analyses = async () => {
    const now = moment().tz('Indian/Antananarivo').format('HH:mm:ss')
    const temps = now.split(":")

    temps.forEach((element, index) => {
        temps[index] = parseInt(element)
    })

    const donnees = await prisma.consomation.findMany({
        orderBy: {
            id: 'desc'
        },
        take: 2
    })

    donnees.forEach(element => {
        element.valeur = format_data(element.valeur)
    })
    
    console.log(donnees)

    const avant_hier = donnees[0].valeur.energy
    const hier = donnees[1].valeur.energy

    let difference = Math.abs(hier - avant_hier)
    let pourcentage = Math.round((difference / hier) * 100)

    console.log(avant_hier, hier, difference, pourcentage)

    if (temps[0] === 0 && temps[1] === 40 && temps[2] === 0) {
    }

}