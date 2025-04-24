import { Request, Response } from 'express';
import { ControleJornadaService } from '../services/ControleJornadaService';

/**
 * Controlador para gerenciar o controle de jornada
 * Controller to manage work day records
 */
export class ControleJornadaController {
  private controleJornadaService: ControleJornadaService;

  constructor() {
    this.controleJornadaService = new ControleJornadaService();
  }

  /**
   * Cria um novo registro de jornada
   * Creates a new work day record
   * @param req Express Request
   * @param res Express Response
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const registro = await this.controleJornadaService.create(req.body);
      res.status(201).json(registro);
    } catch (error) {
      console.error('Erro ao criar registro de jornada:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao criar registro de jornada'
      });
    }
  }

  /**
   * Atualiza um registro de jornada existente
   * Updates an existing work day record
   * @param req Express Request
   * @param res Express Response
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const registro = await this.controleJornadaService.update({
        id,
        ...req.body
      });
      res.json(registro);
    } catch (error) {
      console.error('Erro ao atualizar registro de jornada:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao atualizar registro de jornada'
      });
    }
  }

  /**
   * Busca um registro de jornada pelo ID
   * Finds a work day record by ID
   * @param req Express Request
   * @param res Express Response
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const registro = await this.controleJornadaService.findById(id);
      
      if (!registro) {
        res.status(404).json({ message: 'Registro de jornada não encontrado' });
        return;
      }
      
      res.json(registro);
    } catch (error) {
      console.error('Erro ao buscar registro de jornada:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao buscar registro de jornada'
      });
    }
  }

  /**
   * Lista todos os registros de jornada de um funcionário
   * Lists all work day records for an employee
   * @param req Express Request
   * @param res Express Response
   */
  async findByFuncionarioId(req: Request, res: Response): Promise<void> {
    try {
      const { funcionarioId } = req.params;
      const { mes } = req.query;
      
      const registros = await this.controleJornadaService.findByFuncionarioId(
        funcionarioId,
        mes ? String(mes) : undefined
      );
      
      res.json(registros);
    } catch (error) {
      console.error('Erro ao listar registros de jornada:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao listar registros de jornada'
      });
    }
  }

  /**
   * Exclui um registro de jornada
   * Deletes a work day record
   * @param req Express Request
   * @param res Express Response
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.controleJornadaService.delete(id);
      res.status(204).end();
    } catch (error) {
      console.error('Erro ao excluir registro de jornada:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao excluir registro de jornada'
      });
    }
  }

  /**
   * Calcula o total de horas trabalhadas por um funcionário em um mês
   * Calculates total hours worked by an employee in a month
   * @param req Express Request
   * @param res Express Response
   */
  async calcularHorasMensais(req: Request, res: Response): Promise<void> {
    try {
      const { funcionarioId } = req.params;
      const { mes } = req.query;
      
      if (!mes) {
        res.status(400).json({ message: 'O parâmetro "mes" é obrigatório' });
        return;
      }
      
      const horas = await this.controleJornadaService.calcularHorasMensais(
        funcionarioId,
        String(mes)
      );
      
      res.json(horas);
    } catch (error) {
      console.error('Erro ao calcular horas mensais:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao calcular horas mensais'
      });
    }
  }
} 