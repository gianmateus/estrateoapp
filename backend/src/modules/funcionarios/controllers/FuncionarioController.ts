import { Request, Response } from 'express';
import { FuncionarioService } from '../services/FuncionarioService';
import { PDFGenerator } from '../utils/pdfGenerator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Configuração do Multer para upload de arquivos
 * Multer configuration for file uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../../..', 'uploads');
    
    // Cria o diretório se não existir
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, `contrato-${uniqueSuffix}${fileExt}`);
  }
});

export const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // Aceita apenas PDF e DOCX
    // Accept only PDF and DOCX
    const allowedTypes = ['.pdf', '.docx', '.doc'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      return cb(null, true);
    }
    
    cb(new Error('Apenas arquivos PDF e DOCX são permitidos'));
  }
});

/**
 * Controlador para gerenciar funcionários
 * Controller to manage employees
 */
export class FuncionarioController {
  private funcionarioService: FuncionarioService;
  private pdfGenerator: PDFGenerator;

  constructor() {
    this.funcionarioService = new FuncionarioService();
    this.pdfGenerator = new PDFGenerator();
  }

  /**
   * Cria um novo funcionário
   * Creates a new employee
   * @param req Express Request
   * @param res Express Response
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const funcionario = await this.funcionarioService.create(req.body);
      res.status(201).json(funcionario);
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao criar funcionário'
      });
    }
  }

  /**
   * Atualiza um funcionário existente
   * Updates an existing employee
   * @param req Express Request
   * @param res Express Response
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const funcionario = await this.funcionarioService.update({
        id,
        ...req.body
      });
      res.json(funcionario);
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao atualizar funcionário'
      });
    }
  }

  /**
   * Busca um funcionário pelo ID
   * Finds an employee by ID
   * @param req Express Request
   * @param res Express Response
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const funcionario = await this.funcionarioService.findById(id);
      
      if (!funcionario) {
        res.status(404).json({ message: 'Funcionário não encontrado' });
        return;
      }
      
      res.json(funcionario);
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao buscar funcionário'
      });
    }
  }

  /**
   * Lista todos os funcionários com filtros opcionais
   * Lists all employees with optional filters
   * @param req Express Request
   * @param res Express Response
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { nome, cargo, tipoContrato, status } = req.query;
      
      const filters = {
        ...(nome && { nome: String(nome) }),
        ...(cargo && { cargo: String(cargo) }),
        ...(tipoContrato && { tipoContrato: String(tipoContrato) }),
        ...(status && { status: String(status) })
      };
      
      const funcionarios = await this.funcionarioService.findAll(filters);
      res.json(funcionarios);
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao listar funcionários'
      });
    }
  }

  /**
   * Exclui um funcionário (soft delete)
   * Deletes an employee (soft delete)
   * @param req Express Request
   * @param res Express Response
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.funcionarioService.delete(id);
      res.status(204).end();
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao excluir funcionário'
      });
    }
  }

  /**
   * Conta o número de funcionários por tipo de contrato
   * Counts the number of employees by contract type
   * @param req Express Request
   * @param res Express Response
   */
  async countByContractType(req: Request, res: Response): Promise<void> {
    try {
      const count = await this.funcionarioService.countByContractType();
      res.json(count);
    } catch (error) {
      console.error('Erro ao contar funcionários por tipo de contrato:', error);
      res.status(400).json({
        message: error instanceof Error 
          ? error.message 
          : 'Erro ao contar funcionários por tipo de contrato'
      });
    }
  }

  /**
   * Faz upload de contrato de trabalho
   * Uploads a work contract
   * @param req Express Request
   * @param res Express Response
   */
  async uploadContrato(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const file = req.file;
      
      if (!file) {
        res.status(400).json({ message: 'Nenhum arquivo enviado' });
        return;
      }
      
      // Atualiza o funcionário com o caminho do arquivo
      // Update employee with file path
      const contratoUploadUrl = `/uploads/${file.filename}`;
      
      const funcionario = await this.funcionarioService.update({
        id,
        contratoUploadUrl
      });
      
      res.json({
        message: 'Contrato enviado com sucesso',
        funcionario
      });
    } catch (error) {
      console.error('Erro ao enviar contrato:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao enviar contrato'
      });
    }
  }

  /**
   * Gera PDF com dados do funcionário
   * Generates PDF with employee data
   * @param req Express Request
   * @param res Express Response
   */
  async generatePDF(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const filePath = await this.pdfGenerator.generateFuncionarioPDF(id);
      
      // Obtém apenas o nome do arquivo
      // Get only the filename
      const fileName = path.basename(filePath);
      
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