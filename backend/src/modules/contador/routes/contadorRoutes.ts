/**
 * Routes for the Contador (Accountant) module
 * Handles PDF report generation and financial data endpoints
 * 
 * Rotas para o módulo Contador
 * Gerencia endpoints de geração de relatórios PDF e dados financeiros
 */
import express from 'express';
import { ContadorController } from '../controllers/contadorController';
import { authMiddleware } from '../../../middlewares';
import { permissionMiddleware } from '../../../middlewares';

const router = express.Router();
const contadorController = new ContadorController();

// Middleware to check for financial view permission
// Middleware para verificar permissão de visualização financeira
const checkFinancialPermission = permissionMiddleware.checkPermission('financeiro.visualizar');

/**
 * @route   GET /api/contador/dados/:mes
 * @desc    Get financial data for specific month
 * @access  Private (requires finance permission)
 * 
 * @route   GET /api/contador/dados/:mes
 * @desc    Obter dados financeiros para um mês específico
 * @access  Privado (requer permissão de finanças)
 */
router.get(
  '/dados/:mes', 
  [authMiddleware, checkFinancialPermission], 
  contadorController.getDadosMensais
);

/**
 * @route   GET /api/contador/relatorio/:mes
 * @desc    Generate PDF report for specific month
 * @access  Private (requires finance permission)
 * 
 * @route   GET /api/contador/relatorio/:mes
 * @desc    Gerar relatório PDF para um mês específico
 * @access  Privado (requer permissão de finanças)
 */
router.get(
  '/relatorio/:mes', 
  [authMiddleware, checkFinancialPermission], 
  contadorController.gerarRelatorioPDF
);

export default router; 