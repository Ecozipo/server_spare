export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]

    const usedToken = await prisma.usedToken.findFirst({ where: { token: token } })
    if (usedToken) return res.status(500).send({ errorMessage: "Token déjà utilisé" })

    const decoded = jwt.verify(token, SECRET_KEY)

    if (!decoded) return res.status(500).send({ errorMessage: "Token invalide" })

    req.decoded = decoded
    next()
}