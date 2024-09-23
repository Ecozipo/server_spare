import { PrismaClient } from "@prisma/client";
import { io } from "socket.io-client";

const prisma = new PrismaClient()
const socket = io("ws://localhost:5000")

const analyses = async () => {
    const consomations = await prisma.consomation.findMany()
    console.log(consomations)
}

const newModuleConnectedAnalyse= async () => {
    socket.on('vitesse', (data) => {
        console.log(data)
    })
}