import { PrismaClient } from "@prisma/client"
import { existsSync } from "fs"
import jwt from 'jsonwebtoken'
import path, { dirname } from "path"


const prisma = new PrismaClient()

export const modifFournisseur = async (req, res) => {
    const token = { id, token } = req.body
    const { nom, telephone, quartier } = req.body.data
    const image = req.files.image
    try {
        const admin = (await jwt.decode(token)).admin
        if (!admin) {
            res.status(500).send({ errorMessage: "Token invalide" })
        }

        const fournisseur = await prisma.fournisseur.findUnique({ where: { id: parseInt(id) } })

        if (!fournisseur) return res.status(500).json({ messageError: "Fournisseur introuvable" })
        const lastpath = dirname(fournisseur.image)

        const fileSize = image.data.length;
        const ext = path.extname(image.name);
        const fileName = image.md5 + ext;
        const allowedTypes = ['.png', '.jpg', '.jpeg'];

        const imagePath = path.resolve(__dirname, '..', 'assets', 'fournisseur', fileName)
        const url = `${req.protocol}://${req.get("host")}/fournisseur/${fileName}`;

        if (!allowedTypes.includes(ext.toLowerCase())) return res.status(500).json({ messageError: "Image invalide" })
        if (fileSize > 5000000) return res.status(500).json({ messageError: "Image devrait être moins de 5 MB" })

        if (!existsSync(imagePath)) {
            fs.mkdirSync(imagePath)
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
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}

export const createFournisseur = async (req, res) => {
    const token = req.body.token
    const { nom, telephone, quartier } = req.body.data
    const image = req.files.image
    try {
        const admin = (await jwt.decode(token)).admin
        if (!admin) {
            res.status(500).send({ errorMessage: "Token invalide" })
        }

        const fileSize = image.data.length;
        const ext = path.extname(image.name);
        const fileName = image.md5 + ext;
        const allowedTypes = ['.png', '.jpg', '.jpeg'];

        const imagePath = path.resolve(__dirname, '..', 'assets', 'fournisseur', fileName)
        const url = `${req.protocol}://${req.get("host")}/fournisseur/${fileName}`;

        if (!allowedTypes.includes(ext.toLowerCase())) return res.status(500).json({ messageError: "Image invalide" })
        if (fileSize > 5000000) return res.status(500).json({ messageError: "Image devrait être moins de 5 MB" })

        if (!existsSync(imagePath)) {
            fs.mkdirSync(imagePath)
        }

        image.mv(imagePath, async (err) => {
            if (err) return res.status(500).json({ messageError: err.message })
            try {
                await prisma.fournisseur.create({
                    data: {
                        nom,
                        telephone,
                        quartier,
                        image: fileName,
                        url,
                    }
                })
            } catch (error) {
                res.status(500).send({ messageError: "Erreur de connexion" })
                console.log(error)
            }
        })

        res.status(200).send({ messageSuccess: "Fournisseur ajouté  avec succès" })

    } catch (error) {
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}

export const deleteFournisseur = async (req, res) => {
    const { id, token } = req.body
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
        res.status(500).send({ errorMessage: "Internal server error" })
    }
}