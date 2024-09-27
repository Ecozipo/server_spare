import { PrismaClient } from "@prisma/client";
import fs, { existsSync, mkdirSync } from "fs"
import path, { dirname } from "path"

const prisma = new PrismaClient()

export const addProfessionnal = async (req, res) => {
    const { nom, mail, telephone, description,quartier,type_pro } = req.body
    const image = req.file
    if (!image) {
        return res.status(400).send({ errorMessage: "Aucun fichier uploadé." });
    }
    try {

        const fileSize = image.size;
        const ext = path.extname(image.originalname);
        const fileName = [image.filename, ext].join('');
        const allowedTypes = ['.png', '.jpg', '.jpeg'];

        const imagePath = path.resolve(path.dirname('assets'), 'assets', 'professionnel', fileName);
        const url = `${req.protocol}://${req.get("host")}/assets/professionnel/${fileName}`;

        if (!allowedTypes.includes(ext.toLowerCase())) {
            return res.status(400).json({ messageError: "Image invalide" });
        }
        if (fileSize > 5000000) {
            return res.status(400).json({ messageError: "Image devrait être moins de 5 MB" });
        }

        if (!existsSync(imagePath)) {
            mkdirSync(imagePath)
        }

        image.mv(imagePath, async (err) => {
            if (err) return res.status(500).json({ messageError: err.message });

            try {
                const professionnel = await prisma.professionnel.create({
                    data: {
                        nom,
                        mail,
                        telephone,
                        quartier: parseInt(quartier),
                        description: description,
                        image: fileName,
                        url,
                        type_pro: parseInt(type_pro)
                    }
                })
                res.status(200).json(professionnel)
            } catch (error) {
                res.status(500).send({ errorMessage: "Internal server error" })
            }
        })
    } catch (error) {
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}