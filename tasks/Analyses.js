import { PrismaClient } from "@prisma/client";
import { io } from "socket.io-client";
import moment from "moment-timezone";
import { format_data } from "../data/functions.js";
import { setPercent } from "../data/State.js";

const prisma = new PrismaClient()
const socket = io("ws://localhost:5000")

export const analyses = async () => {

    const now = moment().tz('Indian/Antananarivo').format('HH:mm:ss')
    const temps = now.split(":")
    
    temps.forEach((element, index) => {
        temps[index] = parseInt(element)
    })
    
    // if (temps[0] === 0 && temps[1] === 0 && temps[2] === 1) {
        
        try{
            const avant_hier =  moment().tz(timeZone).subtract(2, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss').toString()
            const hier =  moment().tz(timeZone).subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss').toString()
    
            let consom_hier , consom_avant_hier = 0

            const donnees = await prisma.consomation.findMany({
                where: {
                    date_consommation: {
                        gte: avant_hier
                    }
                },
                orderBy: {
                    date_consommation: 'asc'
                },
                take: 48
            })
        
            donnees.forEach(element => {
                element.valeur = format_data(element.valeur)
            })
            
            const avant_hier_data = donnees.filter(element =>{
                let date = new Date(element.date_consommation).getDate()
                return date === new Date(avant_hier).getDate()
            })

            const hier_data = donnees.filter(element =>{
                let date = new Date(element.date_consommation).getDate()
                return date === new Date(hier).getDate()
            })
            
            avant_hier_data.forEach(element => {
                consom_avant_hier += parseFloat(element.valeur.energy)
            })

            hier_data.forEach(element => {
                consom_hier += parseFloat(element.valeur.energy)
            })

            console.log(donnees)
        
            
        
            let difference = Math.abs(consom_hier - consom_avant_hier)
            let pourcentage = Math.round((difference / consom_hier) * 100)
        
            console.log(consom_avant_hier, consom_hier, difference, pourcentage)
    
            setPercent(parseFloat(pourcentage))
    
        }catch(error){
    
            console.log(error)
    
        }

    // }

}