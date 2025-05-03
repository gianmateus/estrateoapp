import { PrismaClient } from '@prisma/client';
import { 
  CreateInteracaoClienteDTO, 
  UpdateInteracaoClienteDTO 
} from '../models/clienteTypes';

/**
 * Serviço para gerenciar interações com clientes
 * Service to manage client interactions
 */
export class InteracaoClienteService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Cria uma nova interação com cliente
   * Creates a new client interaction
   * @param data Dados da interação
   * @returns Interação criada
   */
  async create(data: CreateInteracaoClienteDTO): Promise<any> {
    try {
      // Verifica se o cliente existe
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: data.clienteId }
      });
      
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }
      
      return await this.prisma.interacaoCliente.create({
        data: {
          clienteId: data.clienteId,
          tipo: data.tipo,
          titulo: data.titulo,
          descricao: data.descricao,
          data: data.data || new Date(),
          responsavel: data.responsavel,
          resultado: data.resultado,
          proximaAcao: data.proximaAcao,
          dataProximaAcao: data.dataProximaAcao,
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
      console.error('Erro ao criar interação com cliente:', error);
      throw new Error(error instanceof Error ? error.message : 'Não foi possível criar a interação com o cliente');
    }
  }

  /**
   * Atualiza uma interação com cliente
   * Updates a client interaction
   * @param data Dados atualizados da interação
   * @returns Interação atualizada
   */
  async update(data: UpdateInteracaoClienteDTO): Promise<any> {
    try {
      const { id, ...updateData } = data;
      
      return await this.prisma.interacaoCliente.update({
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
      console.error('Erro ao atualizar interação com cliente:', error);
      throw new Error('Não foi possível atualizar a interação com o cliente');
    }
  }

  /**
   * Busca uma interação com cliente pelo ID
   * Finds a client interaction by ID
   * @param id ID da interação
   * @returns Interação encontrada ou null
   */
  async findById(id: string): Promise<any | null> {
    try {
      return await this.prisma.interacaoCliente.findUnique({
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
      console.error('Erro ao buscar interação com cliente:', error);
      throw new Error('Não foi possível buscar a interação com o cliente');
    }
  }

  /**
   * Lista interações de um cliente
   * Lists interactions of a client
   * @param clienteId ID do cliente
   * @returns Lista de interações
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
      
      return await this.prisma.interacaoCliente.findMany({
        where: { clienteId },
        orderBy: { data: 'desc' },
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
      console.error('Erro ao listar interações do cliente:', error);
      throw new Error(error instanceof Error ? error.message : 'Não foi possível listar as interações do cliente');
    }
  }

  /**
   * Remove uma interação com cliente
   * Removes a client interaction
   * @param id ID da interação
   * @returns void
   */
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.interacaoCliente.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Erro ao excluir interação com cliente:', error);
      throw new Error('Não foi possível excluir a interação com o cliente');
    }
  }

  /**
   * Lista interações por período
   * Lists interactions by period
   * @param dataInicio Data de início
   * @param dataFim Data de fim
   * @returns Lista de interações no período
   */
  async findByPeriod(dataInicio: Date, dataFim: Date): Promise<any[]> {
    try {
      return await this.prisma.interacaoCliente.findMany({
        where: {
          data: {
            gte: dataInicio,
            lte: dataFim
          }
        },
        orderBy: { data: 'desc' },
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
      console.error('Erro ao listar interações por período:', error);
      throw new Error('Não foi possível listar as interações por período');
    }
  }

  /**
   * Lista próximas ações agendadas
   * Lists scheduled next actions
   * @param dias Número de dias a considerar
   * @returns Lista de interações com próximas ações
   */
  async findNextActions(dias: number = 7): Promise<any[]> {
    try {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + dias);
      
      return await this.prisma.interacaoCliente.findMany({
        where: {
          dataProximaAcao: {
            gte: new Date(),
            lte: dataLimite
          }
        },
        orderBy: { dataProximaAcao: 'asc' },
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              empresa: true,
              telefone: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar próximas ações:', error);
      throw new Error('Não foi possível listar as próximas ações');
    }
  }
} 