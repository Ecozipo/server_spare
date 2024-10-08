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
    
    if (temps[0] === 0 && temps[1] === 0 && temps[2] === 1) {
        
        try{
            const avant_hier =  moment().tz('Indian/Antananarivo').utc().subtract(2, 'days').startOf('day').toISOString()
            const hier =  moment().tz('Indian/Antananarivo').utc().subtract(1, 'days').startOf('day').toISOString()
    
            let consom_hier = 0 , consom_avant_hier = 0
            console.log(avant_hier, hier, new Date(avant_hier).setHours(0,0,0,0))
 
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

            // Bien vérifier que l'heure commence à 00:00 et que la taille du vecteur soit égale à 24
            // console.log(donnees)
            
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

            // console.log({avant_hier_data,hier_data})
            // console.log({consom_avant_hier, consom_hier})
            
        
            let difference = consom_hier - consom_avant_hier
            let pourcentage = (difference / consom_hier) * 100
        
            console.log(consom_avant_hier, consom_hier, difference,Math.round(pourcentage*1000)/1000)
    
            setPercent(parseFloat(Math.round(pourcentage*1000)/1000))
    
        }catch(error){
    
            console.log(error)
    
        }

    }

}