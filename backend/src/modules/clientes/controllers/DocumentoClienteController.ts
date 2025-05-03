import { Request, Response } from 'express';
import { DocumentoClienteService } from '../services/DocumentoClienteService';
import { EventBus } from '../../../lib/EventBus';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Configuração do Multer para upload de arquivos
 * Multer configuration for file uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../../../uploads/clientes');
    
    // Cria o diretório se não existir
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const fileExt = path.extname(file.originalname);
    
    // Usa o nome original do arquivo, mas com um sufixo único para evitar colisões
    // Uses the original filename, but with a unique suffix to avoid collisions
    const fileName = `${path.basename(file.originalname, fileExt)}-${uniqueSuffix}${fileExt}`;
    
    cb(null, fileName);
  }
});

// Filtro de arquivos para aceitar apenas determinados tipos
// File filter to accept only certain types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const documentoClienteService = new DocumentoClienteService();
  
  if (documentoClienteService.validarTipoArquivo(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas PDF, DOCX, XLS, XLSX, JPG e PNG são aceitos'));
  }
};

export const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

/**
 * Controlador para gerenciar documentos de clientes
 * Controller to manage client documents
 */
export class DocumentoClienteController {
  private documentoClienteService: DocumentoClienteService;

  constructor() {
    this.documentoClienteService = new DocumentoClienteService();
  }

  /**
   * Upload de documento para cliente
   * Uploads a document for a client
   * @param req Express Request
   * @param res Express Response
   */
  async upload(req: Request, res: Response): Promise<void> {
    try {
      const { clienteId, tipo, descricao } = req.body;
      const file = req.file;
      
      if (!clienteId) {
        res.status(400).json({ message: 'ID do cliente é obrigatório' });
        return;
      }
      
      if (!tipo) {
        res.status(400).json({ message: 'Tipo de documento é obrigatório' });
        return;
      }
      
      if (!file) {
        res.status(400).json({ message: 'Nenhum arquivo enviado' });
        return;
      }
      
      // Validar tipo do arquivo
      if (!this.documentoClienteService.validarTipoArquivo(file.mimetype)) {
        res.status(400).json({ message: 'Tipo de arquivo não permitido' });
        return;
      }
      
      // Validar tamanho do arquivo (10MB máximo)
      if (!this.documentoClienteService.validarTamanhoArquivo(file.size, 10)) {
        res.status(400).json({ message: 'Arquivo muito grande. Tamanho máximo: 10MB' });
        return;
      }
      
      // Caminho relativo do arquivo para armazenar no banco de dados
      const caminhoArquivo = `/uploads/clientes/${file.filename}`;
      
      // Criar documento no banco de dados
      const documento = await this.documentoClienteService.create({
        clienteId,
        tipo,
        nome: file.originalname,
        descricao: descricao || '',
        caminhoArquivo,
        tamanhoBytes: file.size,
        mimeType: file.mimetype
      });
      
      // Emitir evento de documento adicionado
      EventBus.emit('cliente.documento.adicionado', documento);
      
      res.status(201).json(documento);
    } catch (error) {
      console.error('Erro ao fazer upload de documento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao fazer upload de documento'
      });
    }
  }

  /**
   * Atualiza informações de um documento
   * Updates information about a document
   * @param req Express Request
   * @param res Express Response
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { tipo, nome, descricao } = req.body;
      
      // Buscar dados atuais do documento para comparação
      const documentoAnterior = await this.documentoClienteService.findById(id);
      
      if (!documentoAnterior) {
        res.status(404).json({ message: 'Documento não encontrado' });
        return;
      }
      
      const documento = await this.documentoClienteService.update({
        id,
        tipo,
        nome,
        descricao
      });
      
      // Emitir evento de documento atualizado
      EventBus.emit('cliente.documento.atualizado', {
        anterior: documentoAnterior,
        atual: documento
      });
      
      res.json(documento);
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao atualizar documento'
      });
    }
  }

  /**
   * Busca um documento pelo ID
   * Finds a document by ID
   * @param req Express Request
   * @param res Express Response
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const documento = await this.documentoClienteService.findById(id);
      
      if (!documento) {
        res.status(404).json({ message: 'Documento não encontrado' });
        return;
      }
      
      res.json(documento);
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao buscar documento'
      });
    }
  }

  /**
   * Lista documentos de um cliente
   * Lists documents of a client
   * @param req Express Request
   * @param res Express Response
   */
  async findByClienteId(req: Request, res: Response): Promise<void> {
    try {
      const { clienteId } = req.params;
      const documentos = await this.documentoClienteService.findByClienteId(clienteId);
      
      res.json(documentos);
    } catch (error) {
      console.error('Erro ao listar documentos do cliente:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao listar documentos do cliente'
      });
    }
  }

  /**
   * Baixa um documento
   * Downloads a document
   * @param req Express Request
   * @param res Express Response
   */
  async download(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const documento = await this.documentoClienteService.findById(id);
      
      if (!documento) {
        res.status(404).json({ message: 'Documento não encontrado' });
        return;
      }
      
      // Construir caminho absoluto do arquivo
      const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../../../uploads/clientes');
      const filePath = path.join(uploadDir, path.basename(documento.caminhoArquivo));
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ message: 'Arquivo físico não encontrado' });
        return;
      }
      
      // Configurar cabeçalhos da resposta
      res.setHeader('Content-Type', documento.mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${documento.nome}"`);
      
      // Enviar o arquivo
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao baixar documento'
      });
    }
  }

  /**
   * Remove um documento
   * Removes a document
   * @param req Express Request
   * @param res Express Response
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Buscar dados atuais do documento antes de excluir
      const documento = await this.documentoClienteService.findById(id);
      
      if (!documento) {
        res.status(404).json({ message: 'Documento não encontrado' });
        return;
      }
      
      await this.documentoClienteService.delete(id);
      
      // Emitir evento de documento removido
      EventBus.emit('cliente.documento.removido', documento);
      
      res.status(204).end();
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao excluir documento'
      });
    }
  }

  /**
   * Lista documentos por tipo
   * Lists documents by type
   * @param req Express Request
   * @param res Express Response
   */
  async findByType(req: Request, res: Response): Promise<void> {
    try {
      const { tipo } = req.params;
      
      if (!tipo) {
        res.status(400).json({ message: 'Tipo de documento é obrigatório' });
        return;
      }
      
      const documentos = await this.documentoClienteService.findByType(tipo);
      
      res.json(documentos);
    } catch (error) {
      console.error('Erro ao listar documentos por tipo:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro ao listar documentos por tipo'
      });
    }
  }
} 