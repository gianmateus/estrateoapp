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
import contadorRoutes from './contadorRoutes';
import taxRoutes from './taxRoutes';

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

// Rotas de impostos
router.use('/taxes', authMiddleware, taxRoutes);

// Rotas para o controlador do Contador, atendendo o mercado alemão

// GET /contador/dados/:periodo
// Obtém dados financeiros para o período especificado

// POST /contador/impostos/calcular
// Calcula impostos alemães a partir de dados enviados

// POST /contador/relatorios/elster
// Gera relatório no formato ELSTER

// POST /contador/relatorios/xbrl
// Gera relatório no formato XBRL

// GET /contador/relatorios/pdf
// Gera relatório PDF com dados fiscais

// GET /contador/configuracoes/impostos
// Obtém configurações de impostos por tipo de produto/serviço

// PUT /contador/configuracoes/impostos
// Atualiza configurações de impostos

// Outras rotas serão adicionadas aqui

export default router; 