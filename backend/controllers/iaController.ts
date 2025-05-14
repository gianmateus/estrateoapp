import { Request, Response } from 'express';
import { 
  buscarRecomendacoes, 
  marcarRecomendacaoComoLida 
} from '../services/iaService';
import { logger } from '../utils/logger';

/**
 * Obtém as recomendações do dia atual para o usuário
 */
export async function obterRecomendacoesDoDia(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      res.status(400).json({ error: 'O ID do usuário é obrigatório' });
      return;
    }
    
    // Buscar recomendações do dia atual
    const recomendacoes = await buscarRecomendacoes(userId, new Date());
    
    res.json({
      success: true,
      recomendacoes
    });
  } catch (erro) {
    logger.error('Erro ao obter recomendações do dia:', erro);
    res.status(500).json({ error: 'Erro ao buscar recomendações' });
  }
}

/**
 * Obtém o histórico de recomendações do usuário
 */
export async function obterHistoricoRecomendacoes(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const { dataInicio, dataFim } = req.query;
    
    if (!userId) {
      res.status(400).json({ error: 'O ID do usuário é obrigatório' });
      return;
    }
    
    // Buscar todas as recomendações (sem filtro de data)
    const recomendacoes = await buscarRecomendacoes(userId);
    
    // Filtrar por datas se necessário
    let recomendacoesFiltradas = recomendacoes;
    
    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio as string);
      const fim = new Date(dataFim as string);
      
      recomendacoesFiltradas = recomendacoes.filter(rec => {
        const data = new Date(rec.data);
        return data >= inicio && data <= fim;
      });
    }
    
    res.json({
      success: true,
      recomendacoes: recomendacoesFiltradas
    });
  } catch (erro) {
    logger.error('Erro ao obter histórico de recomendações:', erro);
    res.status(500).json({ error: 'Erro ao buscar histórico de recomendações' });
  }
}

/**
 * Marca uma recomendação como lida
 */
export async function marcarComoLida(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'O ID da recomendação é obrigatório' });
      return;
    }
    
    const sucesso = await marcarRecomendacaoComoLida(id);
    
    if (sucesso) {
      res.json({ success: true, message: 'Recomendação marcada como lida com sucesso' });
    } else {
      res.status(404).json({ error: 'Recomendação não encontrada' });
    }
  } catch (erro) {
    logger.error('Erro ao marcar recomendação como lida:', erro);
    res.status(500).json({ error: 'Erro ao marcar recomendação como lida' });
  }
} 