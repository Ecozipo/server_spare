import { PrismaClient } from "@prisma/client";
import device from "../utils/awsDevice.js";

const prisma = new PrismaClient()

const setNotification = (notification) => {

    const { titre, subject } = notification

    try {
        const newNotification = prisma.notifications.create({
            data: {
                titre,
                subject
            }
        })

        // Emettre la notification
        device.emit('notification', 'sent', JSON.stringify(notification))

    } catch (error) {
        console.log(error)
    }


}

export default setNotification