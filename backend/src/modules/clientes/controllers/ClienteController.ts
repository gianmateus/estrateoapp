import { Request, Response } from 'express';
import { ClienteService } from '../services/ClienteService';
import { EventBus } from '../../../lib/EventBus';

/**
 * Controlador para gerenciar clientes
 * Controller to manage clients
 */
export class ClienteController {
  private clienteService: ClienteService;

  constructor() {
    this.clienteService = new ClienteService();
  }

  /**
   * Cria um novo cliente
   * Creates a new client
   * @param req Express Request
   * @param res Express Response
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const cliente = await this.clienteService.create(req.body);
      
      // Emitir evento de cliente cadastrado
      EventBus.emit('cliente.cadastrado', cliente);
      
      res.status(201).json(cliente);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao criar cliente'
      });
    }
  }

  /**
   * Atualiza um cliente existente
   * Updates an existing client
   * @param req Express Request
   * @param res Express Response
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Buscar dados atuais do cliente para comparação
      const clienteAnterior = await this.clienteService.findById(id);
      
      if (!clienteAnterior) {
        res.status(404).json({ message: 'Cliente não encontrado' });
        return;
      }
      
      const cliente = await this.clienteService.update({
        id,
        ...req.body
      });
      
      // Emitir evento de cliente atualizado
      EventBus.emit('cliente.atualizado', {
        anterior: clienteAnterior,
        atual: cliente
      });
      
      // Verificar se houve alteração no status
      if (req.body.status && clienteAnterior.status !== req.body.status) {
        EventBus.emit('cliente.status.alterado', {
          clienteId: id,
          statusAnterior: clienteAnterior.status,
          statusNovo: req.body.status,
          dataMudanca: new Date()
        });
      }
      
      res.json(cliente);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao atualizar cliente'
      });
    }
  }

  /**
   * Busca um cliente pelo ID
   * Finds a client by ID
   * @param req Express Request
   * @param res Express Response
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cliente = await this.clienteService.findById(id);
      
      if (!cliente) {
        res.status(404).json({ message: 'Cliente não encontrado' });
        return;
      }
      
      res.json(cliente);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao buscar cliente'
      });
    }
  }

  /**
   * Lista todos os clientes com filtros opcionais
   * Lists all clients with optional filters
   * @param req Express Request
   * @param res Express Response
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { 
        nome, 
        empresa, 
        email, 
        telefone, 
        documentoPrincipal, 
        tipo, 
        status, 
        segmento,
        page = '1',
        pageSize = '10'
      } = req.query;
      
      const filters = {
        ...(nome && { nome: String(nome) }),
        ...(empresa && { empresa: String(empresa) }),
        ...(email && { email: String(email) }),
        ...(telefone && { telefone: String(telefone) }),
        ...(documentoPrincipal && { documentoPrincipal: String(documentoPrincipal) }),
        ...(tipo && { tipo: String(tipo) }),
        ...(status && { status: String(status) }),
        ...(segmento && { segmento: String(segmento) })
      };
      
      const pageNumber = parseInt(String(page), 10);
      const pageSizeNumber = parseInt(String(pageSize), 10);
      
      const clientes = await this.clienteService.findAll(
        filters, 
        pageNumber, 
        pageSizeNumber
      );
      
      res.json(clientes);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao listar clientes'
      });
    }
  }

  /**
   * Remove um cliente (soft delete)
   * Removes a client (soft delete)
   * @param req Express Request
   * @param res Express Response
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Buscar dados atuais do cliente antes de excluir
      const cliente = await this.clienteService.findById(id);
      
      if (!cliente) {
        res.status(404).json({ message: 'Cliente não encontrado' });
        return;
      }
      
      await this.clienteService.delete(id);
      
      // Emitir evento de cliente removido
      EventBus.emit('cliente.removido', cliente);
      
      res.status(204).end();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao excluir cliente'
      });
    }
  }

  /**
   * Busca clientes por termo
   * Search clients by term
   * @param req Express Request
   * @param res Express Response
   */
  async search(req: Request, res: Response): Promise<void> {
    try {
      const { term, limit = '10' } = req.query;
      
      if (!term) {
        res.status(400).json({ message: 'O termo de busca é obrigatório' });
        return;
      }
      
      const limitNumber = parseInt(String(limit), 10);
      const clientes = await this.clienteService.search(String(term), limitNumber);
      
      res.json(clientes);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao buscar clientes'
      });
    }
  }

  /**
   * Obtém estatísticas de clientes por status
   * Gets client statistics by status
   * @param req Express Request
   * @param res Express Response
   */
  async countByStatus(req: Request, res: Response): Promise<void> {
    try {
      const contagem = await this.clienteService.countByStatus();
      res.json(contagem);
    } catch (error) {
      console.error('Erro ao contar clientes por status:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao contar clientes por status'
      });
    }
  }

  /**
   * Obtém estatísticas de clientes por tipo
   * Gets client statistics by type
   * @param req Express Request
   * @param res Express Response
   */
  async countByType(req: Request, res: Response): Promise<void> {
    try {
      const contagem = await this.clienteService.countByType();
      res.json(contagem);
    } catch (error) {
      console.error('Erro ao contar clientes por tipo:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao contar clientes por tipo'
      });
    }
  }
} 