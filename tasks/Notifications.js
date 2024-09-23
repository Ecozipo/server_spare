import { PrismaClient } from "@prisma/client";
import device from "../utils/awsDevice.js";

const prisma = new PrismaClient()

const setNotification = async (notification) => {

    const { titre, subject } = notification

    try {
        const newNotification = await prisma.notifications.create({
            data: {
                titre,
                subject
            }
        })

        console.log({ newNotification })
        // Emettre la notification
        device.emit('notification', 'sent', notification)

    } catch (error) {
        console.log(error)
    }


}

export default setNotification