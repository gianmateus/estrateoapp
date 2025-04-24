import { PrismaClient } from '@prisma/client';
import { 
  CreateFuncionarioDTO, 
  UpdateFuncionarioDTO, 
  FuncionarioFilters 
} from '../models/funcionarioTypes';

/**
 * Serviço para gerenciar funcionários
 * Service to manage employees
 */
export class FuncionarioService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Cria um novo funcionário
   * Creates a new employee
   * @param data Dados do funcionário
   * @returns Funcionário criado
   */
  async create(data: CreateFuncionarioDTO): Promise<any> {
    try {
      // Converte array de dias para formato adequado para armazenamento
      // Converts days array to proper format for storage
      return await this.prisma.funcionario.create({
        data: {
          nome: data.nome,
          cargo: data.cargo,
          tipoContrato: data.tipoContrato,
          dataAdmissao: data.dataAdmissao,
          salarioBruto: data.salarioBruto,
          pagamentoPorHora: data.pagamentoPorHora,
          horasSemana: data.horasSemana,
          diasTrabalho: data.diasTrabalho,
          iban: data.iban,
          status: 'ativo',
          observacoes: data.observacoes,
          contratoUploadUrl: data.contratoUploadUrl,
        },
      });
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw new Error('Não foi possível criar o funcionário');
    }
  }

  /**
   * Atualiza dados de um funcionário
   * Updates employee data
   * @param data Dados atualizados do funcionário
   * @returns Funcionário atualizado
   */
  async update(data: UpdateFuncionarioDTO): Promise<any> {
    try {
      const { id, ...updateData } = data;
      
      return await this.prisma.funcionario.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      throw new Error('Não foi possível atualizar o funcionário');
    }
  }

  /**
   * Busca um funcionário pelo ID
   * Finds an employee by ID
   * @param id ID do funcionário
   * @returns Funcionário encontrado ou null
   */
  async findById(id: string): Promise<any | null> {
    try {
      return await this.prisma.funcionario.findUnique({
        where: { id },
        include: {
          controleJornada: true,
          resumoPagamento: true
        }
      });
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      throw new Error('Não foi possível buscar o funcionário');
    }
  }

  /**
   * Lista todos os funcionários com filtros opcionais
   * Lists all employees with optional filters
   * @param filters Filtros opcionais
   * @returns Lista de funcionários
   */
  async findAll(filters?: FuncionarioFilters): Promise<any[]> {
    try {
      const where: any = {};
      
      if (filters) {
        if (filters.nome) {
          where.nome = { contains: filters.nome };
        }
        
        if (filters.cargo) {
          where.cargo = { contains: filters.cargo };
        }
        
        if (filters.tipoContrato) {
          where.tipoContrato = filters.tipoContrato;
        }
        
        if (filters.status) {
          where.status = filters.status;
        }
      }
      
      return await this.prisma.funcionario.findMany({
        where,
        orderBy: { nome: 'asc' },
      });
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      throw new Error('Não foi possível listar os funcionários');
    }
  }

  /**
   * Exclui um funcionário (marcando como inativo)
   * Deletes an employee (by marking as inactive)
   * @param id ID do funcionário
   * @returns Funcionário atualizado
   */
  async delete(id: string): Promise<any> {
    try {
      // Soft delete: apenas altera o status para inativo
      // Soft delete: only changes status to inactive
      return await this.prisma.funcionario.update({
        where: { id },
        data: { status: 'inativo' },
      });
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      throw new Error('Não foi possível excluir o funcionário');
    }
  }

  /**
   * Conta o número de funcionários ativos por tipo de contrato
   * Counts the number of active employees by contract type
   * @returns Contagem por tipo de contrato
   */
  async countByContractType(): Promise<Record<string, number>> {
    try {
      const funcionarios = await this.prisma.funcionario.findMany({
        where: { status: 'ativo' },
        select: { tipoContrato: true },
      });

      const result: Record<string, number> = {
        Minijob: 0,
        Teilzeit: 0,
        Vollzeit: 0,
        Freelancer: 0,
      };

      funcionarios.forEach((funcionario: any) => {
        result[funcionario.tipoContrato] += 1;
      });

      return result;
    } catch (error) {
      console.error('Erro ao contar funcionários por tipo de contrato:', error);
      throw new Error('Não foi possível contar os funcionários por tipo de contrato');
    }
  }

  /**
   * Busca funcionários com contrato do tipo MiniJob
   * Finds employees with MiniJob contract type
   * @returns Lista de funcionários com contrato MiniJob
   */
  async findMiniJobEmployees(): Promise<any[]> {
    try {
      return await this.prisma.funcionario.findMany({
        where: { 
          tipoContrato: 'Minijob',
          status: 'ativo' 
        },
      });
    } catch (error) {
      console.error('Erro ao buscar funcionários MiniJob:', error);
      throw new Error('Não foi possível buscar os funcionários MiniJob');
    }
  }
} 