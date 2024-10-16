import { PrismaClient } from "@prisma/client";
import { setTotal } from "../data/State";

const prisma = new PrismaClient();

export const calculer = async (req, res) => {
    /**
     * @params
     * categorie utilisateur : entreprise/foyer simple
     * type de module: eau / electricite / les deux
     * 
     * si seulement module eau : nbre pompes
     * si seulement module electricite : {nbre ampoule, nbre prise}
     * si les deux : nbre pompes, nbre ampoule, nbre prise
     * 
     * submit : calculer
     */
    const { client }=req.body
    const { categorie, nbre_module } = req.body;
    const { robinets,ampoules,prises } = req.body

    let prix_final = 0 
    let module = null

    switch (categorie) {
        case "eau":
            // const {robinets} = req.body
            module = await prisma.modulEau.findFirst({
                where: {
                    robinets: parseInt(robinets)
                }
            })
            
            prix_final = parseInt(module.prix)
            
            break
        case "électricité":
            // const {ampoules,prises} = req.body
            module = await prisma.modulElec.findFirst({
                where:{
                    ampoules: parseInt(ampoules),
                    prises: parseInt(prises)
                }
            })

            prix_final = parseInt(module.prix)
            break
        default:
           let eau = await prisma.modulEau.findFirst({
                where: {
                    robinets: parseInt(robinets)
                }
            })
            let elec = await prisma.modulElec.findFirst({
                where:{
                    ampoules: parseInt(ampoules),
                    prises: parseInt(prises)
                }
            })

            prix_final = parseInt(eau.prix) + parseInt(elec.prix)
            break
    }

    const depart = (client === "foyer simple") ? 15000 : 400000
    const total = prix_final * parseInt(nbre_module) + depart

    const idCateg = await  prisma.categ_modulAb.findFirst({
        where: {
            nomCateg: categorie
        }
    })

    await prisma.calculAb.create({
        data: {
            categorie: idCateg.id,
            total: total
        }
    })

    setTotal(total)
    res.status(200).json(total)

}