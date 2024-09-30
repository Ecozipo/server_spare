import { PrismaClient } from "@prisma/client";
import { io } from "socket.io-client";
import device from "../utils/awsDevice.js";

const prisma = new PrismaClient()
const socket = io("ws://localhost:5000");

const setNotification = async (notification) => {

    const {titre,subject} = notification

    try{
        const newNotification = await prisma.notifications.create({
            data: {
                titre,
                subject
            }
        })

        // Emettre la notification
        device.emit('notification','push/notif',JSON.stringify(notification))
        socket.emit('notification',JSON.stringify(notification))

        console.log(newNotification)
    }catch(error){
        console.log(error)
    }

    
}

export default setNotification