import express from 'express';
import { createUser, deleteUser, getAllUser, getSingleUser, updateUser, userLogin, userRegister } from '../controllers/userController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { userMiddleware } from '../middlewares/userMiddleware.js';



// init router 
const router = express.Router();

// route REST API 
router.route('/').get(adminMiddleware , getAllUser).post(adminMiddleware, createUser);
router.route('/:id').get(userMiddleware, getSingleUser).delete(userMiddleware, deleteUser).put(userMiddleware, updateUser).patch(userMiddleware, updateUser); 

// user Auth Route 
router.post('/login', userLogin);
router.post('/register', userRegister);


// export default router 
export default router;