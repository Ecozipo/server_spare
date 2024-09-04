import { Router } from "express";
import { getModules, removeModule, modifyModule } from "../controllers/ModuleController";

const router = Router()

router.post('/getmodules', getModules)
router.post('/removemodule', removeModule)
router.post('/modifymodule', modifyModule)

export default router