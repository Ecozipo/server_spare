import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDevices = async (req, res) => {

    const { id } = req.params

    const devices = await prisma.module.findMany({
        include: {
            Utilisateur: true,
            TypeModule: true,
            Achat: true,
        },
        where: {
            Achat: {
                utilisateur: parseInt(id)
            }
        }
    })

    if (devices.length === 0) {
        res.status(404).json({ message: "Aucun module trouvé" })
    }

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

    const {id_utilisateur,nom,type,prix,reference} = req.body

    const Utilisateur = await prisma.utilisateur.findUnique({
        where: {
            id: parseInt(id_utilisateur)
        }
    })
    if(!Utilisateur){
        res.status(404).json({message:"Utilisateur non trouvé"})
    }
    const device = await prisma.module.create({
        data: {
            nom: nom,
            type: parseInt(type),
            prix: prix,
            reference: reference,
        }
    });
    res.status(200).json(device);
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