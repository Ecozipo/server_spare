import { Router } from "express"
import { getAllUsers, getUserById } from "../controllers/UserRouter"
import { deleteUser, modifUser } from "../controllers/admin/UserController"


const router = Router()

router.get('/all', getAllUsers)
router.post('/getbyId', getUserById)

router.put('/admin/modif', modifUser)
router.post('/admin/delete', deleteUser)


export default router