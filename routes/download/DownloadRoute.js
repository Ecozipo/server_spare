import { Router } from "express"
import path from "path"

const router = Router()

router.get('/download', (req, res) => {
    const filePath = path.resolve(path.dirname('download'), 'download', 'Spare.apk')
    res.download(filePath, (error) => {
        if (error) console.log(error)
    })
})

export default router