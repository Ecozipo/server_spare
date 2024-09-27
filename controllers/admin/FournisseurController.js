import { PrismaClient } from "@prisma/client"
import fs,{ existsSync, mkdirSync } from "fs"
import jwt from 'jsonwebtoken'
import path, { dirname } from "path"


const prisma = new PrismaClient()

export const modifFournisseur = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const { id,nom, telephone,description, quartier } = req.body;

    const image = req.file

    if (!image) {
        return res.status(400).send({ errorMessage: "Aucun fichier uploadé." });
    }

    try {
        const admin = (jwt.decode(token)).admin
        if (!admin) {
            res.status(500).send({ errorMessage: "Token invalide" })
        }

        const fournisseur = await prisma.fournisseur.findUnique({ where: { id: parseInt(id) } })

        if (!fournisseur) return res.status(500).json({ messageError: "Fournisseur introuvable" })
        const lastpath = dirname(fournisseur.image)

        const fileSize = image.size;
        const ext = path.extname(image.name);
        const fileName = image.md5 + ext;
        const allowedTypes = ['.png', '.jpg', '.jpeg'];

        const imagePath = path.resolve(__dirname, '..', 'assets', 'fournisseur', fileName)
        const url = `${req.protocol}://${req.get("host")}/assets/fournisseur/${fileName}.${ext}`;

        if (!allowedTypes.includes(ext.toLowerCase())) return res.status(500).json({ messageError: "Image invalide" })
        if (fileSize > 5000000) return res.status(500).json({ messageError: "Image devrait être moins de 5 MB" })

        if (!existsSync(imagePath)) {
            mkdirSync(imagePath)
        }

        image.mv(imagePath, async (err) => {
            if (err) return res.status(500).json({ messageError: err.message })
            try {
                await prisma.fournisseur.update({
                    where: { id: parseInt(id) },
                    data: {
                        nom,
                        telephone,
                        quartier,
                        description,
                        image: fileName,
                        url,
                    }
                })

                fs.unlinkSync(lastpath)

                res.status(200).send({ messageSuccess: "Modification effectuée avec succès" })
            } catch (error) {
                res.status(500).send({ messageError: "Erreur de connexion" })
                console.log(error)
            }
        })
        res.status(200).send({ utilisateur })
    } catch (error) {
        console.log(error)
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}

export const createFournisseur = async (req, res) => {
    // const token = req.headers.authorization.split(" ")[1];
    const { nom, telephone, quartier } = req.body;

    const image = req.file;
    if (!image) {
        return res.status(400).send({ errorMessage: "Aucun fichier uploadé." });
    }

    try {
        // const admin = (await jwt.decode(token)).admin;
        // if (!admin) {
        //     return res.status(401).send({ errorMessage: "Token invalide" });
        // }

        const fileSize = image.size; 
        const ext = path.extname(image.originalname);
        const fileName = [image.filename,ext].join('');
        const allowedTypes = ['.png', '.jpg', '.jpeg'];

        const imagePath = path.resolve(path.dirname('assets'),'assets','fournisseur', fileName);
        const url = `${req.protocol}://${req.get("host")}/assets/fournisseur/${fileName}`;

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
                await prisma.fournisseur.create({
                    data: {
                        nom,
                        telephone,
                        quartier:parseInt(quartier),
                        image: fileName,
                        url,
                    }
                });
                res.status(200).send({ messageSuccess: "Fournisseur ajouté avec succès" });
            } catch (error) {
                res.status(500).send({ messageError: "Erreur de connexion" });
                console.error(error);
            }
        });

    } catch (error) {
        res.status(500).send({ errorMessage: "Internal server error" });
        console.error(error);
    }
};


export const deleteFournisseur = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const { id } = req.body
    try {
        const admin = (await jwt.decode(token)).admin
        if (!admin) {
            res.status(500).send({ errorMessage: "Token invalide" })
        }
        const fournisseur = await prisma.fournisseur.findUnique({ where: { id: parseInt(id) } })

        if (!fournisseur) return res.status(500).json({ messageError: "Fournisseur introuvable" })
        const fileName = fournisseur.image

        const imagePath = dirname(fileName)

        const suppression = await prisma.fournisseur.delete({
            where: { id: parseInt(id) }
        })
        fs.unlinkSync(imagePath)
        res.status(200).send({ message: "Suppression réussie" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}