import { Router } from 'express';
import ContadorRelatorioInternoController from '../controllers/ContadorRelatorioInternoController';
import { autenticarToken } from '../middlewares/auth';

const router = Router();

// Rota para obter dados do relatório mensal interno
router.get('/relatorio-interno', autenticarToken, ContadorRelatorioInternoController.gerarRelatorioInterno);

export default router; 