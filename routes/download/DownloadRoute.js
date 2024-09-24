import { Router } from "express"
import path from "path"

const router = Router()

router.get('/download', (req, res) => {
    const filePath = path.resolve(path.dirname('download'), 'download', 'download.txt')
    res.download(path.dirname(filePath), (error) => {
        if (error) console.log(error)
    })
})

export default router