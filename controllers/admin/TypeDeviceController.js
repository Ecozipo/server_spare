import { PrismaClient } from "@prisma/client";
import fs, { existsSync, mkdirSync } from "fs";
import path, { dirname } from "path";

const prisma = new PrismaClient();

export const getTypeDevices = async (req, res) => {
    try {

        const allTypeDevice = await prisma.typeDevice.findMany();

        res.status(200).send(allTypeDevice);

    } catch (error) {
        console.log(error);
        res.status(500).send({ errorMessage: "Internal server error" });
    }
};

export const createTypeDevice = async (req, res) => {
    const { type } = req.body;

    const image = req.file;
    if (!image) {
        return res.status(400).send({ errorMessage: "Aucun fichier uploadé." });
    }

    
    try {
        const fileSize = image.size;
        const ext = path.extname(image.originalname);
        const fileName = [image.filename, ext].join("");
        const allowedTypes = [".png", ".jpg", ".jpeg"];
        
        const imagePath = path.resolve(dirname("assets"), "assets", "typeDevice", fileName);
        const url = `${req.protocol}://${req.get("host")}/assets/typeDevice/${fileName}`;

        if (!allowedTypes.includes(ext.toLowerCase())) {
            return res.status(400).json({ messageError: "Image invalide" });
        }
        if (fileSize > 5000000) {
            return res.status(400).json({ messageError: "Image devrait être moins de 5 MB" });
        }

        const dir = path.dirname(imagePath);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }

        fs.rename(image.path, imagePath, async (err) => {
            if (err) return res.status(500).json({ messageError: err.message });

            try {
                await prisma.typeDevice.create({
                    data: {
                        type,
                        image: fileName,
                        url
                    },
                });
                res.status(200).send({ messageSuccess: "TypeDevice ajouté avec succès" });
            } catch (error) {
                console.error(error);
                res.status(500).send({ messageError: "Erreur de connexion" });
            }
        });
    } catch (error) {
        res.status(500).send({ errorMessage: "Internal server error" });
        console.error(error);
    }
};