import { Router } from 'express';
import authRoutes from '../modules/auth/routes';
import userRoutes from '../modules/user/routes';
import funcionarioRoutes from '../modules/funcionarios/routes';
import pagamentoRoutes from '../modules/pagamentos/routes';
import financeiroRoutes from '../modules/financeiro/routes';
import inventarioRoutes from '../modules/inventario/routes';
import clienteRoutes from '../modules/clientes/routes';
import { authMiddleware } from '../middlewares';
import dashboardRoutes from './dashboardRoutes';
import contadorRoutes from '../modules/contador/routes/contadorRoutes';

const router = Router();

// Rotas públicas
router.use('/auth', authRoutes);

// Rotas protegidas
router.use('/users', userRoutes);
router.use('/funcionarios', funcionarioRoutes);
router.use('/pagamentos', pagamentoRoutes);
router.use('/financeiro', financeiroRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/clientes', clienteRoutes);

// Rotas protegidas por autenticação
// O middleware de permissões é aplicado nas rotas específicas
router.use('/dashboard', authMiddleware, dashboardRoutes);

// Rotas de contador
router.use('/contador', contadorRoutes);

// Outras rotas serão adicionadas aqui

export default router; 