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
  async create(data: any): Promise<any> {
    try {
      return await this.prisma.funcionario.create({
        data: {
          nomeCompleto: data.nomeCompleto,
          cargo: data.cargo,
          departamento: data.departamento,
          emailProfissional: data.emailProfissional,
          telefone: data.telefone,
          endereco: data.endereco,
          cidade: data.cidade,
          cep: data.cep,
          pais: data.pais,
          steurId: data.steurId,
          nacionalidade: data.nacionalidade,
          idiomas: Array.isArray(data.idiomas) ? data.idiomas.join(',') : data.idiomas,
          dataAdmissao: new Date(data.dataAdmissao),
          tipoContrato: data.tipoContrato,
          jornadaSemanal: Number(data.jornadaSemanal),
          diasTrabalho: Array.isArray(data.diasTrabalho) ? data.diasTrabalho.join(',') : data.diasTrabalho,
          salarioBruto: Number(data.salarioBruto),
          status: data.status || 'ativo',
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
  async update(data: any): Promise<any> {
    try {
      const { id, ...updateData } = data;
      return await this.prisma.funcionario.update({
        where: { id },
        data: {
          nomeCompleto: updateData.nomeCompleto,
          cargo: updateData.cargo,
          departamento: updateData.departamento,
          emailProfissional: updateData.emailProfissional,
          telefone: updateData.telefone,
          endereco: updateData.endereco,
          cidade: updateData.cidade,
          cep: updateData.cep,
          pais: updateData.pais,
          steurId: updateData.steurId,
          nacionalidade: updateData.nacionalidade,
          idiomas: Array.isArray(updateData.idiomas) ? updateData.idiomas.join(',') : updateData.idiomas,
          dataAdmissao: new Date(updateData.dataAdmissao),
          tipoContrato: updateData.tipoContrato,
          jornadaSemanal: Number(updateData.jornadaSemanal),
          diasTrabalho: Array.isArray(updateData.diasTrabalho) ? updateData.diasTrabalho.join(',') : updateData.diasTrabalho,
          salarioBruto: Number(updateData.salarioBruto),
          status: updateData.status,
          observacoes: updateData.observacoes,
          contratoUploadUrl: updateData.contratoUploadUrl,
        },
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
      const funcionario = await this.prisma.funcionario.findUnique({
        where: { id },
        include: {
          controleJornada: true,
          resumoPagamento: true
        }
      });
      if (funcionario) {
        funcionario.idiomas = funcionario.idiomas ? funcionario.idiomas.split(',') : [];
        funcionario.diasTrabalho = funcionario.diasTrabalho ? funcionario.diasTrabalho.split(',') : [];
      }
      return funcionario;
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
  async findAll(filters?: any): Promise<any[]> {
    try {
      const where: any = {};
      if (filters) {
        if (filters.nomeCompleto) {
          where.nomeCompleto = { contains: filters.nomeCompleto };
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
      const funcionarios = await this.prisma.funcionario.findMany({
        where,
        orderBy: { nomeCompleto: 'asc' },
      });
      return funcionarios.map(f => ({
        ...f,
        idiomas: f.idiomas ? f.idiomas.split(',') : [],
        diasTrabalho: f.diasTrabalho ? f.diasTrabalho.split(',') : [],
      }));
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

  /**
   * Conta funcionários por situação atual
   * Counts employees by current situation
   * @returns Contagem por situação
   */
  async countBySituacao(): Promise<Record<string, number>> {
    try {
      const funcionarios = await this.prisma.funcionario.findMany({
        select: { situacaoAtual: true },
      });

      const result: Record<string, number> = {
        ativo: 0,
        ferias: 0,
        afastado: 0,
        desligado: 0,
      };

      funcionarios.forEach((funcionario: any) => {
        if (funcionario.situacaoAtual) {
          result[funcionario.situacaoAtual] += 1;
        } else {
          // Se não tiver situação, considerar como ativo (para compatibilidade)
          result['ativo'] += 1;
        }
      });

      return result;
    } catch (error) {
      console.error('Erro ao contar funcionários por situação:', error);
      throw new Error('Não foi possível contar os funcionários por situação');
    }
  }
} 