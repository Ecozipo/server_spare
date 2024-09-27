import {Router} from 'express'
import { getStats } from '../controllers/StatsController.js'

const router = Router()

router.get('/percent',getStats)


export default router