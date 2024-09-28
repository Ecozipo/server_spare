import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const getAssistances = async () => {
    console.log("getAssistances")
    try{
        const assistance = await prisma.assistance.findFirst(
            {
                orderBy: {
                    created_at: 'desc'
                },
                skip: Math.round(Math.random()*10)
            }
        )
        console.log(assistance)
    }catch(error){
        console.log(error)
    }
}