import { PrismaClient } from '@prisma/client';
import { 
  CreateClienteDTO, 
  UpdateClienteDTO, 
  ClienteFilters
} from '../models/clienteTypes';

/**
 * Serviço para gerenciar clientes
 * Service to manage clients
 */
export class ClienteService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Cria um novo cliente
   * Creates a new client
   * @param data Dados do cliente
   * @returns Cliente criado
   */
  async create(data: CreateClienteDTO): Promise<any> {
    try {
      return await this.prisma.cliente.create({
        data: {
          tipo: data.tipo,
          nome: data.nome,
          empresa: data.empresa,
          email: data.email,
          telefone: data.telefone,
          documentoPrincipal: data.documentoPrincipal,
          endereco: data.endereco,
          website: data.website,
          segmento: data.segmento,
          anotacoes: data.anotacoes,
          status: data.status || 'ativo',
        },
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw new Error('Não foi possível criar o cliente');
    }
  }

  /**
   * Atualiza dados de um cliente
   * Updates client data
   * @param data Dados atualizados do cliente
   * @returns Cliente atualizado
   */
  async update(data: UpdateClienteDTO): Promise<any> {
    try {
      const { id, ...updateData } = data;
      
      return await this.prisma.cliente.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw new Error('Não foi possível atualizar o cliente');
    }
  }

  /**
   * Busca um cliente pelo ID
   * Finds a client by ID
   * @param id ID do cliente
   * @returns Cliente encontrado ou null
   */
  async findById(id: string): Promise<any | null> {
    try {
      return await this.prisma.cliente.findUnique({
        where: { id },
        include: {
          interacoes: {
            orderBy: { data: 'desc' },
          },
          documentos: true,
        }
      });
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw new Error('Não foi possível buscar o cliente');
    }
  }

  /**
   * Lista todos os clientes com filtros opcionais
   * Lists all clients with optional filters
   * @param filters Filtros opcionais
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista de clientes paginada
   */
  async findAll(filters?: ClienteFilters, page: number = 1, pageSize: number = 10): Promise<any> {
    try {
      const where: any = {};
      
      if (filters) {
        if (filters.nome) {
          where.nome = { contains: filters.nome, mode: 'insensitive' };
        }
        
        if (filters.email) {
          where.email = { contains: filters.email, mode: 'insensitive' };
        }
        
        if (filters.telefone) {
          where.telefone = { contains: filters.telefone };
        }
        
        if (filters.empresa) {
          where.empresa = { contains: filters.empresa, mode: 'insensitive' };
        }
        
        if (filters.documentoPrincipal) {
          where.documentoPrincipal = { contains: filters.documentoPrincipal };
        }
        
        if (filters.tipo) {
          where.tipo = filters.tipo;
        }
        
        if (filters.status) {
          where.status = filters.status;
        }
        
        if (filters.segmento) {
          where.segmento = { contains: filters.segmento, mode: 'insensitive' };
        }
      }
      
      // Calcular skip para paginação
      const skip = (page - 1) * pageSize;
      
      // Buscar clientes com contagem total
      const [clientes, total] = await Promise.all([
        this.prisma.cliente.findMany({
          where,
          orderBy: { nome: 'asc' },
          skip,
          take: pageSize,
          include: {
            _count: {
              select: {
                interacoes: true,
                documentos: true
              }
            }
          }
        }),
        this.prisma.cliente.count({ where })
      ]);
      
      // Calcular total de páginas
      const totalPages = Math.ceil(total / pageSize);
      
      return {
        data: clientes,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          pageSize
        }
      };
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw new Error('Não foi possível listar os clientes');
    }
  }

  /**
   * Remove um cliente (soft delete marcando como inativo)
   * Removes a client (soft delete by marking as inactive)
   * @param id ID do cliente
   * @returns Cliente atualizado
   */
  async delete(id: string): Promise<any> {
    try {
      // Soft delete: apenas altera o status para inativo
      // Soft delete: only changes status to inactive
      return await this.prisma.cliente.update({
        where: { id },
        data: { status: 'inativo' },
      });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw new Error('Não foi possível excluir o cliente');
    }
  }

  /**
   * Busca clientes por termo de pesquisa
   * Searches clients by search term
   * @param term Termo de pesquisa
   * @param limit Limite de resultados
   * @returns Lista de clientes encontrados
   */
  async search(term: string, limit: number = 10): Promise<any[]> {
    try {
      if (!term || term.trim().length < 2) {
        return [];
      }
      
      const searchTerm = term.trim();
      
      return await this.prisma.cliente.findMany({
        where: {
          OR: [
            { nome: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { empresa: { contains: searchTerm, mode: 'insensitive' } },
            { documentoPrincipal: { contains: searchTerm } },
            { telefone: { contains: searchTerm } }
          ],
          status: 'ativo'
        },
        take: limit,
        orderBy: { nome: 'asc' }
      });
    } catch (error) {
      console.error('Erro ao buscar clientes por termo:', error);
      throw new Error('Não foi possível buscar os clientes');
    }
  }

  /**
   * Conta o número de clientes por status
   * Counts the number of clients by status
   * @returns Contagem por status
   */
  async countByStatus(): Promise<Record<string, number>> {
    try {
      const clientes = await this.prisma.cliente.groupBy({
        by: ['status'],
        _count: true
      });
      
      // Formatar o resultado para um objeto Record
      const result: Record<string, number> = {
        ativo: 0,
        inativo: 0,
        prospecto: 0,
        arquivado: 0
      };
      
      clientes.forEach(item => {
        if (item.status && item._count) {
          result[item.status] = item._count;
        }
      });
      
      return result;
    } catch (error) {
      console.error('Erro ao contar clientes por status:', error);
      throw new Error('Não foi possível contar os clientes por status');
    }
  }

  /**
   * Conta o número de clientes por tipo (pessoa física ou jurídica)
   * Counts the number of clients by type (individual or company)
   * @returns Contagem por tipo
   */
  async countByType(): Promise<Record<string, number>> {
    try {
      const clientes = await this.prisma.cliente.groupBy({
        by: ['tipo'],
        _count: true,
        where: {
          status: 'ativo'
        }
      });
      
      // Formatar o resultado para um objeto Record
      const result: Record<string, number> = {
        pessoa_fisica: 0,
        pessoa_juridica: 0
      };
      
      clientes.forEach(item => {
        if (item.tipo && item._count) {
          result[item.tipo] = item._count;
        }
      });
      
      return result;
    } catch (error) {
      console.error('Erro ao contar clientes por tipo:', error);
      throw new Error('Não foi possível contar os clientes por tipo');
    }
  }
} 