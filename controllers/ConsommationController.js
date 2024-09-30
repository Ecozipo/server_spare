import { PrismaClient } from "@prisma/client";
import { format_data } from "../data/functions.js";
import moment from "moment-timezone";

const prisma = new PrismaClient()

const getDays = async () => {

    let days = []

    const consommations = await prisma.consomation.findMany()

    days = consommations.filter(day => {
        
        const date = new Date(day.date_consommation)

        return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0
        
    })

    days.forEach(element => {
        element.valeur = format_data(element.valeur)
    })

    return days
}

export const journalier = async (req, res) => {

    let days = await getDays()

    let consommation = []
    
    days.forEach(day => {

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
    
    let days = await getDays()

    let last_week = [
        moment().tz('Indian/Antananarivo').subtract(1,'week').startOf('week').toISOString(),
        moment().tz('Indian/Antananarivo').subtract(1,'week').endOf('week').toISOString()
    ]

    last_week = days.filter(day => {
        const date = new Date(day.date_consommation)
        return moment(date).tz('Indian/Antananarivo').isBetween(last_week[0],last_week[1])
    })

    let this_week = [
        moment().tz('Indian/Antananarivo').startOf('week').toISOString(),
        moment().tz('Indian/Antananarivo').endOf('week').toISOString()
    ]

    this_week = days.filter(day => {
        const date = new Date(day.date_consommation)
        return moment(date).tz('Indian/Antananarivo').isBetween(this_week[0],this_week[1])
    })

    let consommations = {
        this_week: [],
        last_week: []
    }

    last_week.forEach(day => {
        consommations["last_week"].push(
            {
                date: day.date_consommation,
                consommation: day.valeur.energy
            }
        )
    })

    this_week.forEach(day => {
        consommations["this_week"].push(
            {
                date: day.date_consommation,
                consommation: day.valeur.energy
            }
        )
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