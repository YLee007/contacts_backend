import { Router } from 'express';
import { login, register, logout } from '../controllers/authController';

const router: Router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
