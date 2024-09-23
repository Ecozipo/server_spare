import { PrismaClient } from "@prisma/client";
import device from "../utils/awsDevice.js";

const prisma = new PrismaClient()

const setNotification = async (notification) => {

    const { titre, subject } = notification

    if(titre === "Alerte sur consommation"){
        let i = 0
        if(i===0){
            try {
                const newNotification = await prisma.notifications.create({
                    data: {
                        titre,
                        subject
                    }
                })
                
                // Emettre la notification
                device.emit('notification', 'sent', notification)
    
            } catch (error) {
                console.log(error)
            }
            i++
        }
    }else{
        try {
            const newNotification = await prisma.notifications.create({
                data: {
                    titre,
                    subject
                }
            })
            
            // Emettre la notification
            device.emit('notification', 'sent', notification)

        } catch (error) {
            console.log(error)
        }
    }

}

export default setNotification