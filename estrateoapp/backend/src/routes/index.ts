import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import pagamentoRoutes from './pagamentoRoutes';
import inventarioRoutes from './inventarioRoutes';
import dashboardRoutes from './dashboardRoutes';
import { authMiddleware } from '../middlewares';

const router = Router();

// Rotas de autenticação (algumas são públicas)
router.use('/auth', authRoutes);

// Rotas de usuários (algumas são públicas)
router.use('/users', userRoutes);

// Rotas protegidas por autenticação
// O middleware de permissões é aplicado nas rotas específicas
router.use('/pagamentos', authMiddleware, pagamentoRoutes);
router.use('/inventario', authMiddleware, inventarioRoutes);
router.use('/dashboard', authMiddleware, dashboardRoutes);

// Outras rotas serão adicionadas aqui

export default router; 