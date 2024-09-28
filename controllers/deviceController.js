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

    const {nom,type,prix,reference} = req.body

    const image = req.file

    if(!image){
        return res.status(400).json({message:"Aucun fichier uploadé"})
    }
    // const Utilisateur = await prisma.utilisateur.findUnique({
    //     where: {
    //         id: parseInt(id_utilisateur)
    //     }
    // })

    // if(!Utilisateur){
    //     res.status(404).json({message:"Utilisateur non trouvé"})
    // }

    try{

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
            if (err) return res.status(500).json({ messageError: err.message })
            try{
        
                const device = await prisma.module.create({
                    data: {
                        nom,
                        type: parseInt(type),
                        prix: prix,
                        reference: reference,
                        image: fileName,
                        url
                    }
                })

                res.status(200).json(device)
                
            }catch(error){
                console.log(error)
                res.status(500).json({message:"Erreur de connexion"})
            }

        })

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