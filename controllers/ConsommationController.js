import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const journalier = async (req, res) => {
    const consommations = await prisma.consomation.findMany()
    res.status(200).json(consommations)
}

export const hebdomadaire = async (req, res) => {
    console.log("hebdomadaire")
   const consommations = await prisma.consomation.findMany({
        orderBy:{
            date_consommation: 'desc'
        },
        take: 7
    })

    res.status(200).json(consommations)
}

export const mensuel = (req, res) => {

}

export const restartByZero = (req, res) => {

}

export const stat_days = async (req,res)=>{

    let values = []

    const days = await prisma.consomation.findMany({
        orderBy:{
            date_consommation: 'desc'
        },
        take: 2
    })

    days.forEach(day => {
        const value = JSON.parse(day.valeur)
        values.push(parseInt(value.energy))
    })


    let percentage = parseFloat(((values[1]-values[0])/values[0])*100)

    percentage = percentage.toFixed(2)
    
    res.status(200).json({percentage})
}