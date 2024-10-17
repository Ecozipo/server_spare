import {Router} from 'express'
import { getStats, getHoursStats } from '../controllers/StatsController.js'


const router = Router()

router.get('/percent',getStats)
router.get('/hour',getHoursStats)


export default router