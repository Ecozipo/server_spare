import { PrismaClient } from "@prisma/client";
import { io } from "socket.io-client";
import moment from "moment-timezone";

const prisma = new PrismaClient()
const socket = io("ws://localhost:5000")

export const analyses = async () => {
    const now = moment().tz('Indian/Antananarivo').format('HH:mm:ss')
    const temps = now.split(":")

    temps.forEach((element, index) => {
        temps[index] = parseInt(element)
    })

    if (temps[0] === 0 && temps[1] === 30 && temps[2] === 0) {
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

export const newModuleConnectedAnalyse = async () => {
    socket.on('vitesse', (data) => {
        console.log(data)
    })
}