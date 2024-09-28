import { PrismaClient } from "@prisma/client";
import device from "../utils/awsDevice.js";

const prisma = new PrismaClient()

export const getAssistances = async () => {
    console.log("getAssistances")
    try{

        const assistance = await prisma.assistance.findMany({
            orderBy: {
                created_at: 'desc'
            },
            skip: Math.round(Math.random()*10)
        })
        const {titre,description} = assistance[0]
        device.emit('notification','push/notif',JSON.stringify({titre,subject:description}))

    }catch(error){
        console.log(error)
    }
}