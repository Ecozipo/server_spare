import { PrismaClient } from "@prisma/client";
import { io } from "socket.io-client";

const prisma = new PrismaClient()
const socket = io("ws://localhost:5000");

const setNotification = (notification) => {

    const {titre,subject} = notification

    try{
        const newNotification = prisma.notifications.create({
            data: {
                titre,
                subject
            }
        })

        // Emettre la notification
        socket.emit('notification',JSON.stringify(notification))

    }catch(error){
        console.log(error)
    }

    
}

export default setNotification