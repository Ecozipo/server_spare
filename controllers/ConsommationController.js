import { PrismaClient } from "@prisma/client";
import { format_data } from "../data/functions.js";
import moment from "moment-timezone";

const prisma = new PrismaClient()

export const journalier = async (req, res) => {
    let days = []
    const consommations = await prisma.consomation.findMany()

    days = consommations.filter(day => {
        
        const date = new Date(day.date_consommation)

        return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0
        
    })

    let consommation = []
    
    days.forEach(day => {
        day.valeur = format_data(day.valeur)

        consommation.push(
            {
                date: day.date_consommation,
                consommation: day.valeur.energy
            }
        )
    })
    
    res.status(200).json(consommation)
}

export const hebdomadaire = async (req, res) => {
    console.log("hebdomadaire")
   const consommations = await prisma.consomation.findMany({
        orderBy:{
            date_consommation: 'desc'
        },
        take: 7
    })

    consommations.forEach(element => {
        element.valeur = format_data(element.valeur)
    })

    res.status(200).json(consommations.reverse())
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