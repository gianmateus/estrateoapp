import { PrismaClient } from '@prisma/client';
import {
  CreateDocumentoClienteDTO,
  UpdateDocumentoClienteDTO
} from '../models/clienteTypes';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

/**
 * Serviço para gerenciar documentos de clientes
 * Service to manage client documents
 */
export class DocumentoClienteService {
  private prisma: PrismaClient;
  private uploadDir: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../../../uploads/clientes');
    
    // Garantir que o diretório de upload existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Cria um novo documento para o cliente
   * Creates a new document for a client
   * @param data Dados do documento
   * @returns Documento criado
   */
  async create(data: CreateDocumentoClienteDTO): Promise<any> {
    try {
      // Verifica se o cliente existe
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: data.clienteId }
      });
      
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }
      
      return await this.prisma.documentoCliente.create({
        data: {
          clienteId: data.clienteId,
          tipo: data.tipo,
          nome: data.nome,
          descricao: data.descricao,
          caminhoArquivo: data.caminhoArquivo,
          tamanhoBytes: data.tamanhoBytes,
          mimeType: data.mimeType
        },
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              empresa: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao criar documento de cliente:', error);
      throw new Error(error instanceof Error ? error.message : 'Não foi possível criar o documento do cliente');
    }
  }

  /**
   * Atualiza um documento de cliente
   * Updates a client document
   * @param data Dados atualizados do documento
   * @returns Documento atualizado
   */
  async update(data: UpdateDocumentoClienteDTO): Promise<any> {
    try {
      const { id, ...updateData } = data;
      
      return await this.prisma.documentoCliente.update({
        where: { id },
        data: updateData,
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              empresa: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar documento de cliente:', error);
      throw new Error('Não foi possível atualizar o documento do cliente');
    }
  }

  /**
   * Busca um documento pelo ID
   * Finds a document by ID
   * @param id ID do documento
   * @returns Documento encontrado ou null
   */
  async findById(id: string): Promise<any | null> {
    try {
      return await this.prisma.documentoCliente.findUnique({
        where: { id },
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              empresa: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      throw new Error('Não foi possível buscar o documento');
    }
  }

  /**
   * Lista documentos de um cliente
   * Lists documents of a client
   * @param clienteId ID do cliente
   * @returns Lista de documentos
   */
  async findByClienteId(clienteId: string): Promise<any[]> {
    try {
      // Verifica se o cliente existe
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: clienteId }
      });
      
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }
      
      return await this.prisma.documentoCliente.findMany({
        where: { clienteId },
        orderBy: { dataCriacao: 'desc' },
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              empresa: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar documentos do cliente:', error);
      throw new Error(error instanceof Error ? error.message : 'Não foi possível listar os documentos do cliente');
    }
  }

  /**
   * Remove um documento de cliente (e o arquivo físico)
   * Removes a client document (and the physical file)
   * @param id ID do documento
   * @returns void
   */
  async delete(id: string): Promise<void> {
    try {
      // Primeiro busca o documento para obter o caminho do arquivo
      const documento = await this.prisma.documentoCliente.findUnique({
        where: { id }
      });
      
      if (!documento) {
        throw new Error('Documento não encontrado');
      }
      
      // Remove o documento do banco de dados
      await this.prisma.documentoCliente.delete({
        where: { id }
      });
      
      // Remove o arquivo físico se existir
      const filePath = path.join(this.uploadDir, path.basename(documento.caminhoArquivo));
      if (fs.existsSync(filePath)) {
        await unlinkAsync(filePath);
      }
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      throw new Error('Não foi possível excluir o documento');
    }
  }

  /**
   * Lista todos os documentos por tipo
   * Lists all documents by type
   * @param tipo Tipo do documento
   * @returns Lista de documentos
   */
  async findByType(tipo: string): Promise<any[]> {
    try {
      return await this.prisma.documentoCliente.findMany({
        where: { tipo },
        orderBy: { dataCriacao: 'desc' },
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              empresa: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar documentos por tipo:', error);
      throw new Error('Não foi possível listar os documentos por tipo');
    }
  }

  /**
   * Valida o tipo de arquivo
   * Validates file type
   * @param mimeType MIME type do arquivo
   * @returns boolean indicando se o tipo é válido
   */
  validarTipoArquivo(mimeType: string): boolean {
    const tiposPermitidos = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    return tiposPermitidos.includes(mimeType);
  }

  /**
   * Valida o tamanho do arquivo
   * Validates file size
   * @param tamanhoBytes Tamanho do arquivo em bytes
   * @param maxSizeMB Tamanho máximo permitido em MB
   * @returns boolean indicando se o tamanho é válido
   */
  validarTamanhoArquivo(tamanhoBytes: number, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return tamanhoBytes <= maxSizeBytes;
  }
} 