import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import pagamentoRoutes from './pagamentoRoutes';
import inventarioRoutes from './inventarioRoutes';
import funcionarioRoutes from './funcionarioRoutes';
import clienteRoutes from './clienteRoutes';
import financeiroRoutes from './financeiroRoutes';
import contadorRoutes from './contadorRoutes';

const router = Router();

// Prefixos para as rotas da API
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/pagamentos', pagamentoRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/funcionarios', funcionarioRoutes);
router.use('/clientes', clienteRoutes);
router.use('/financeiro', financeiroRoutes);
router.use('/contador', contadorRoutes);

export default router; 