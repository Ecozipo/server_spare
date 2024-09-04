import { Router } from 'express';
import { publishCommand, subscribeData } from '../controllers/IotController.js';

const router = Router();

router.post('/publish', publishCommand);
router.get('/subscribe', subscribeData);

export default router;