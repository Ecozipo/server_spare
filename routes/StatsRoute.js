import {Router} from 'express'
import { getStats,getHours } from '../controllers/StatsController.js'


const router = Router()

router.get('/percent',getStats)
router.get('/hour',getHours)


export default router