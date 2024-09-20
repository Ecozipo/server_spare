import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path, { dirname } from "path";

const prisma = new PrismaClient();

export const getAllTypeModule = async (req, res) => {
    const typeModule = await prisma.typeModule.findMany()
    res.status(200).json(typeModule)
}

export const createTypeModule = async (req, res) => {
    const { type } = req.body
    const image = req.file

    if (!image) {
        return res.status(400).send({ errorMessage: "Aucun fichier uploadé." });
    }

    try {
        const fileSize = image.size;
        const ext = path.extname(image.name);
        const fileName = [image.filename, ext].join('');
        const allowedTypes = ['.png', '.jpg', '.jpeg'];

        const imagePath = path.resolve(__dirname, '..', 'assets', 'module', fileName)
        const url = `${req.protocol}://${req.get("host")}/assets/module/${fileName}`;

        if (!allowedTypes.includes(ext.toLowerCase())) return res.status(500).json({ messageError: "Image invalide" })
        if (fileSize > 5000000) return res.status(500).json({ messageError: "Image devrait être moins de 5 MB" })

        const dir = path.dirname(imagePath);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
        }

        fs.rename(image.path, imagePath, async (err) => {
            if (err) return res.status(500).json({ messageError: err.message })
            try {
                await prisma.typeModule.create({
                    data: {
                        type: type,
                        image: fileName,
                        url,
                    }
                })
                res.status(200).send({ messageSuccess: "Module ajouté avec succès" })
            } catch (error) {
                res.status(500).send({ messageError: "Erreur de connexion" })
                console.log(error)
            }
        })

    } catch (error) {
        res.status(500).send({ errorMessage: "Internal server error" })
        console.log(error)
    }
    const typeModule = await prisma.typeModule.create({
        data: {
            type: type,
            image: image,
            url: url
        }
    })
    res.status(200).json(typeModule)
}

export const updateTypeModule = async (req, res) => {
    const { id, type, image, url } = req.body
    const typeModule = await prisma.typeModule.update({
        where: {
            id: id
        },
        data: {
            type: type,
            image: image,
            url: url
        }
    })
    res.status(200).json(typeModule)
}

export const deleteTypeModule = async (req, res) => {
    const { id } = req.body
    const typeModule = await prisma.typeModule.delete({
        where: {
            id: id
        }
    })
    res.status(200).json(typeModule)
}