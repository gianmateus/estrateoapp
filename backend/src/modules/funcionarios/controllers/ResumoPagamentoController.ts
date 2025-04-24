import { Request, Response } from 'express';
import { ResumoPagamentoService } from '../services/ResumoPagamentoService';
import { PDFGenerator } from '../utils/pdfGenerator';

/**
 * Controlador para gerenciar resumos de pagamento
 * Controller to manage payment summaries
 */
export class ResumoPagamentoController {
  private resumoPagamentoService: ResumoPagamentoService;
  private pdfGenerator: PDFGenerator;

  constructor() {
    this.resumoPagamentoService = new ResumoPagamentoService();
    this.pdfGenerator = new PDFGenerator();
  }

  /**
   * Cria um novo resumo de pagamento
   * Creates a new payment summary
   * @param req Express Request
   * @param res Express Response
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const resumo = await this.resumoPagamentoService.create(req.body);
      res.status(201).json(resumo);
    } catch (error) {
      console.error('Erro ao criar resumo de pagamento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao criar resumo de pagamento'
      });
    }
  }

  /**
   * Atualiza um resumo de pagamento existente
   * Updates an existing payment summary
   * @param req Express Request
   * @param res Express Response
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resumo = await this.resumoPagamentoService.update({
        id,
        ...req.body
      });
      res.json(resumo);
    } catch (error) {
      console.error('Erro ao atualizar resumo de pagamento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao atualizar resumo de pagamento'
      });
    }
  }

  /**
   * Marca um resumo de pagamento como enviado para o contador
   * Marks a payment summary as sent to the accountant
   * @param req Express Request
   * @param res Express Response
   */
  async marcarComoEnviado(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resumo = await this.resumoPagamentoService.marcarComoEnviado(id);
      res.json(resumo);
    } catch (error) {
      console.error('Erro ao marcar resumo como enviado:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao marcar resumo como enviado'
      });
    }
  }

  /**
   * Busca um resumo de pagamento pelo ID
   * Finds a payment summary by ID
   * @param req Express Request
   * @param res Express Response
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resumo = await this.resumoPagamentoService.findById(id);
      
      if (!resumo) {
        res.status(404).json({ message: 'Resumo de pagamento não encontrado' });
        return;
      }
      
      res.json(resumo);
    } catch (error) {
      console.error('Erro ao buscar resumo de pagamento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao buscar resumo de pagamento'
      });
    }
  }

  /**
   * Busca um resumo de pagamento pelo funcionário e mês
   * Finds a payment summary by employee and month
   * @param req Express Request
   * @param res Express Response
   */
  async findByFuncionarioEMes(req: Request, res: Response): Promise<void> {
    try {
      const { funcionarioId } = req.params;
      const { mes } = req.query;
      
      if (!mes) {
        res.status(400).json({ message: 'O parâmetro "mes" é obrigatório' });
        return;
      }
      
      const resumo = await this.resumoPagamentoService.findByFuncionarioEMes(
        funcionarioId,
        String(mes)
      );
      
      if (!resumo) {
        res.status(404).json({ message: 'Resumo de pagamento não encontrado' });
        return;
      }
      
      res.json(resumo);
    } catch (error) {
      console.error('Erro ao buscar resumo de pagamento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao buscar resumo de pagamento'
      });
    }
  }

  /**
   * Lista todos os resumos de pagamento de um mês
   * Lists all payment summaries for a month
   * @param req Express Request
   * @param res Express Response
   */
  async findByMes(req: Request, res: Response): Promise<void> {
    try {
      const { mes } = req.params;
      const resumos = await this.resumoPagamentoService.findByMes(mes);
      res.json(resumos);
    } catch (error) {
      console.error('Erro ao listar resumos de pagamento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao listar resumos de pagamento'
      });
    }
  }

  /**
   * Exclui um resumo de pagamento
   * Deletes a payment summary
   * @param req Express Request
   * @param res Express Response
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.resumoPagamentoService.delete(id);
      res.status(204).end();
    } catch (error) {
      console.error('Erro ao excluir resumo de pagamento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao excluir resumo de pagamento'
      });
    }
  }

  /**
   * Gera o resumo de pagamento automaticamente
   * Automatically generates a payment summary
   * @param req Express Request
   * @param res Express Response
   */
  async gerarResumoPagamento(req: Request, res: Response): Promise<void> {
    try {
      const { funcionarioId } = req.params;
      const { mes } = req.query;
      
      if (!mes) {
        res.status(400).json({ message: 'O parâmetro "mes" é obrigatório' });
        return;
      }
      
      const resumo = await this.resumoPagamentoService.gerarResumoPagamento(
        funcionarioId,
        String(mes)
      );
      
      res.status(201).json(resumo);
    } catch (error) {
      console.error('Erro ao gerar resumo de pagamento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao gerar resumo de pagamento'
      });
    }
  }

  /**
   * Gera resumos de pagamento para todos os funcionários ativos
   * Generates payment summaries for all active employees
   * @param req Express Request
   * @param res Express Response
   */
  async gerarResumoTodosFuncionarios(req: Request, res: Response): Promise<void> {
    try {
      const { mes } = req.params;
      const resumos = await this.resumoPagamentoService.gerarResumoTodosFuncionarios(mes);
      res.status(201).json(resumos);
    } catch (error) {
      console.error('Erro ao gerar resumos para todos funcionários:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao gerar resumos para todos funcionários'
      });
    }
  }

  /**
   * Gera PDF com o resumo mensal de pagamentos
   * Generates PDF with monthly payment summary
   * @param req Express Request
   * @param res Express Response
   */
  async generatePDF(req: Request, res: Response): Promise<void> {
    try {
      const { mes } = req.params;
      const filePath = await this.pdfGenerator.generateResumoPagamentoMensalPDF(mes);
      
      // Obtém apenas o nome do arquivo
      // Get only the filename
      const fileName = require('path').basename(filePath);
      
      res.json({
        message: 'PDF gerado com sucesso',
        fileUrl: `/uploads/${fileName}`
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao gerar PDF'
      });
    }
  }
} 