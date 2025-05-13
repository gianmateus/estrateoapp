/**
 * Rotas para o módulo Contador adaptado para o mercado alemão e europeu
 * 
 * Implementa endpoints para:
 * - Consulta de dados financeiros
 * - Cálculo de impostos alemães
 * - Geração de relatórios fiscais ELSTER e XBRL
 * - Configuração de alíquotas por tipo de produto
 */

import { Router } from 'express';
import ContadorController from '../controllers/ContadorController';

const router = Router();

// Dados financeiros
router.get('/dados/:periodo', ContadorController.getDadosFinanceiros);

// Cálculo de impostos
router.post('/impostos/calcular', ContadorController.calcularImpostosAlemanha);

// Relatórios
router.post('/relatorios/elster', ContadorController.gerarRelatorioELSTER);
router.post('/relatorios/xbrl', ContadorController.gerarRelatorioXBRL);
router.get('/relatorios/pdf', ContadorController.gerarRelatorioPDF);

// Configurações de impostos
router.get('/configuracoes/impostos', ContadorController.getConfiguracoesImposto);
router.put('/configuracoes/impostos', ContadorController.atualizarConfiguracoesImposto);

export default router; 