import { Router } from 'express';
import dashboardController from '../controllers/dashboardController';
import { permissionMiddleware } from '../middlewares';
import { VIEW_DASHBOARD_PERMISSION } from '../constants/permissions';

/**
 * Router for dashboard related endpoints
 * Defines routes for dashboard data and statistics
 * 
 * Router para endpoints relacionados ao dashboard
 * Define rotas para dados e estatísticas do dashboard
 */
const router = Router();

/**
 * GET /api/dashboard
 * Returns general dashboard data and statistics
 * Protected by authentication and dashboard view permission
 * 
 * Retorna dados gerais e estatísticas do dashboard
 * Protegido por autenticação e permissão de visualização do dashboard
 */
router.get('/', permissionMiddleware.checkPermission(VIEW_DASHBOARD_PERMISSION), dashboardController.getDashboardData);

export default router; 