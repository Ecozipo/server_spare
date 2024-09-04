import { Router } from "express"
import { modifUser, deleteUser } from "../../controllers/admin/UserController.js"
import { getAllUsers, getUserById } from "../../controllers/UserController.js"

const router = Router()

router.get('/all', getAllUsers)
router.post('/get', getUserById)

router.put('/modif', modifUser)
router.post('/delete', deleteUser)

export default router