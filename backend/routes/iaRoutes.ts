import { Router } from 'express';
import {
  obterRecomendacoesDoDia,
  obterHistoricoRecomendacoes,
  marcarComoLida
} from '../controllers/iaController';
import { autenticarUsuario } from '../middlewares/auth';

const router = Router();

/**
 * Rotas para as recomendações da IA
 * Todas as rotas requerem autenticação do usuário
 */

// Obter recomendações do dia atual
router.get('/recomendacoes/hoje/:userId', autenticarUsuario, obterRecomendacoesDoDia);

// Obter histórico de recomendações
router.get('/recomendacoes/historico/:userId', autenticarUsuario, obterHistoricoRecomendacoes);

// Marcar recomendação como lida
router.put('/recomendacoes/lida/:id', autenticarUsuario, marcarComoLida);

export default router; 