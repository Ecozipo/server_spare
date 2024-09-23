import { PrismaClient } from "@prisma/client";
import { io } from "socket.io-client";
import moment from "moment-timezone";
import setNotification from "./Notifications.js";

const prisma = new PrismaClient()
const socket = io("ws://localhost:5000")

export const analyses = async () => {
    const now = moment().tz('Indian/Antananarivo').format('HH:mm:ss')
    const temps = now.split(":")

    temps.forEach((element, index) => {
        temps[index] = parseInt(element)
    })

    if (temps[0] === 0 && temps[1] === 40 && temps[2] === 0) {
        prisma.consomation.findMany({
            orderBy: {
                id: 'desc'
            },
            take: 2
        }).then((response) => {
            console.log(response)
        })
    }

}

export const newModuleConnectedAnalyse = () => {
    socket.on('vitesse', (data) => {
        console.log(data)
        let marge = data * 2

        if (data >= marge && i === 0) {
            setNotification({ titre: "Alerte", subject: "surconsommation détectée" })
        }
    })
}