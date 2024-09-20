import { Router } from "express";
import multer from "multer";

import { getAllTypeModule, createTypeModule, updateTypeModule, deleteTypeModule } from "../../controllers/admin/AdminModuleController.js";

const upload = multer({ dest: 'assets/' })
const router = Router();

router.get('/all', getAllTypeModule)
router.post('/create', upload.single('image'), createTypeModule)
router.put('/update', upload.single('image'), updateTypeModule)
router.delete('/delete', deleteTypeModule)

export default router;