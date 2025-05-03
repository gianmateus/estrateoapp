import { Request, Response } from 'express';
import { InteracaoClienteService } from '../services/InteracaoClienteService';
import { EventBus } from '../../../lib/EventBus';

/**
 * Controlador para gerenciar interações com clientes
 * Controller to manage client interactions
 */
export class InteracaoClienteController {
  private interacaoClienteService: InteracaoClienteService;

  constructor() {
    this.interacaoClienteService = new InteracaoClienteService();
  }

  /**
   * Cria uma nova interação com cliente
   * Creates a new client interaction
   * @param req Express Request
   * @param res Express Response
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const interacao = await this.interacaoClienteService.create(req.body);
      
      // Emitir evento de interação adicionada
      EventBus.emit('cliente.interacao.adicionada', interacao);
      
      res.status(201).json(interacao);
    } catch (error) {
      console.error('Erro ao criar interação com cliente:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao criar interação com cliente'
      });
    }
  }

  /**
   * Atualiza uma interação com cliente
   * Updates a client interaction
   * @param req Express Request
   * @param res Express Response
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Buscar dados atuais da interação para comparação
      const interacaoAnterior = await this.interacaoClienteService.findById(id);
      
      if (!interacaoAnterior) {
        res.status(404).json({ message: 'Interação não encontrada' });
        return;
      }
      
      const interacao = await this.interacaoClienteService.update({
        id,
        ...req.body
      });
      
      // Emitir evento de interação atualizada
      EventBus.emit('cliente.interacao.atualizada', {
        anterior: interacaoAnterior,
        atual: interacao
      });
      
      res.json(interacao);
    } catch (error) {
      console.error('Erro ao atualizar interação com cliente:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao atualizar interação com cliente'
      });
    }
  }

  /**
   * Busca uma interação pelo ID
   * Finds an interaction by ID
   * @param req Express Request
   * @param res Express Response
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const interacao = await this.interacaoClienteService.findById(id);
      
      if (!interacao) {
        res.status(404).json({ message: 'Interação não encontrada' });
        return;
      }
      
      res.json(interacao);
    } catch (error) {
      console.error('Erro ao buscar interação:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao buscar interação'
      });
    }
  }

  /**
   * Lista interações de um cliente
   * Lists interactions of a client
   * @param req Express Request
   * @param res Express Response
   */
  async findByClienteId(req: Request, res: Response): Promise<void> {
    try {
      const { clienteId } = req.params;
      const interacoes = await this.interacaoClienteService.findByClienteId(clienteId);
      
      res.json(interacoes);
    } catch (error) {
      console.error('Erro ao listar interações do cliente:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao listar interações do cliente'
      });
    }
  }

  /**
   * Remove uma interação com cliente
   * Removes a client interaction
   * @param req Express Request
   * @param res Express Response
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Buscar dados atuais da interação antes de excluir
      const interacao = await this.interacaoClienteService.findById(id);
      
      if (!interacao) {
        res.status(404).json({ message: 'Interação não encontrada' });
        return;
      }
      
      await this.interacaoClienteService.delete(id);
      
      // Emitir evento de interação removida
      EventBus.emit('cliente.interacao.removida', interacao);
      
      res.status(204).end();
    } catch (error) {
      console.error('Erro ao excluir interação:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao excluir interação'
      });
    }
  }

  /**
   * Lista interações por período
   * Lists interactions by period
   * @param req Express Request
   * @param res Express Response
   */
  async findByPeriod(req: Request, res: Response): Promise<void> {
    try {
      const { dataInicio, dataFim } = req.query;
      
      if (!dataInicio || !dataFim) {
        res.status(400).json({ message: 'Data de início e fim são obrigatórias' });
        return;
      }
      
      const inicio = new Date(String(dataInicio));
      const fim = new Date(String(dataFim));
      
      // Ajustar a data final para o fim do dia
      fim.setHours(23, 59, 59, 999);
      
      if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
        res.status(400).json({ message: 'Datas inválidas' });
        return;
      }
      
      const interacoes = await this.interacaoClienteService.findByPeriod(inicio, fim);
      
      res.json(interacoes);
    } catch (error) {
      console.error('Erro ao listar interações por período:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao listar interações por período'
      });
    }
  }

  /**
   * Lista próximas ações agendadas
   * Lists scheduled next actions
   * @param req Express Request
   * @param res Express Response
   */
  async findNextActions(req: Request, res: Response): Promise<void> {
    try {
      const { dias = '7' } = req.query;
      
      const diasNumber = parseInt(String(dias), 10);
      
      if (isNaN(diasNumber) || diasNumber < 1) {
        res.status(400).json({ message: 'Número de dias inválido' });
        return;
      }
      
      const proximasAcoes = await this.interacaoClienteService.findNextActions(diasNumber);
      
      res.json(proximasAcoes);
    } catch (error) {
      console.error('Erro ao listar próximas ações:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao listar próximas ações'
      });
    }
  }
} 