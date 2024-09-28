import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDevices = async (req, res) => {

    const data = []

    const devices = await prisma.module.findMany({
        include: {
            TypeModule: true
        }
    })

    if(!devices) return res.status(500).json({message:"Erreur de connexion"})
        
    devices.forEach(element => {
        data.push({
            id: element.id,
            nom: element.nom,
            type: element.TypeModule.type,
            reference: element.reference,
            image: element.TypeModule.image,
            url: element.TypeModule.url
        })
    })

    res.status(200).json(devices);
};

export const getDevice = async (req, res) => {
    const device = await prisma.module.findUnique({
        where: {
            id: req.params.id,
        },
        include: {
            Quartier: true,
            TypeProfessionnel: true,
            Notifications: true,
        },
    });
    res.status(200).json(device);
};

export const createDevice = async (req, res) => {

    const {nom,type,reference} = req.body

    try{
       
        const device = await prisma.module.create({
            data: {
                nom,
                type: parseInt(type),
                reference: reference
            }
        })

        res.status(200).json(device)
                
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Erreur de connexion"})
    }

        
};

export const updateDevice = async (req, res) => {
    const device = await prisma.Utilisateur.update({
        where: {
            id: req.params.id,
        },
        data: {
            nom: req.body.nom,
            mail: req.body.mail,
            password: req.body.password,
            quartier: req.body.quartier,
        },
    });
    res.status(200).json(device);
};

export const deleteDevice = async (req, res) => {
    const device = await prisma.Utilisateur.delete({
        where: {
            id: req.params.id,
        },
    });
    res.status(200).json(device);
};