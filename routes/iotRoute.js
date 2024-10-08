import { Router } from 'express';
import { publishCommand, subscribeData, subscribeStateLed, totalPower,realTime } from '../controllers/IotController.js';

const router = Router();

router.post('/publish', publishCommand);
router.get('/subscribe', subscribeData);
router.get('/relais', subscribeStateLed);
router.get('/totalPower', totalPower);
router.get('/realtime',realTime);

export default router;