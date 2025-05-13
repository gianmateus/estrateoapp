/**
 * Controlador para geração de relatórios internos administrativos
 */
import { Request, Response } from 'express';
import ContadorRelatorioInternoService from '../services/ContadorRelatorioInternoService';

class ContadorRelatorioInternoController {
  /**
   * Gerar relatório interno com dados consolidados de diferentes módulos
   * @param req Requisição Express
   * @param res Resposta Express
   */
  async gerarRelatorioInterno(req: Request, res: Response): Promise<void> {
    try {
      const { mes } = req.query;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ mensagem: 'Usuário não autenticado' });
        return;
      }
      
      if (!mes || typeof mes !== 'string') {
        res.status(400).json({ mensagem: 'Mês inválido ou não informado (formato esperado: YYYY-MM)' });
        return;
      }
      
      // Obter dados do relatório
      const relatorioService = new ContadorRelatorioInternoService();
      const dadosRelatorio = await relatorioService.getDadosRelatorio(userId, mes);
      
      res.status(200).json(dadosRelatorio);
    } catch (error) {
      console.error(`Erro ao gerar relatório interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      res.status(500).json({ mensagem: 'Erro ao gerar relatório interno' });
    }
  }
}

export default new ContadorRelatorioInternoController(); 