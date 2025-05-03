import { Router } from 'express';
import authController from '../controllers/authController';
import passwordController from '../controllers/passwordController';
import authMiddleware from '../middlewares/authMiddleware';
import { authLimiter } from '../middlewares';

const router = Router();

// Rotas públicas com proteção mais restritiva contra brute force
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh-token', authLimiter, authController.refreshToken);

// Rotas de recuperação de senha
router.post('/request-password-reset', authLimiter, passwordController.requestPasswordReset);
router.post('/reset-password', authLimiter, passwordController.resetPassword);

// Rota protegida (requer autenticação)
router.get('/me', authMiddleware, authController.me);

export default router; 