import { PrismaClient } from '@prisma/client';
import { 
  CreateResumoPagamentoDTO,
  UpdateResumoPagamentoDTO
} from '../models/funcionarioTypes';
import { ControleJornadaService } from './ControleJornadaService';

/**
 * Serviço para gerenciar resumos de pagamento
 * Service to manage payment summaries
 */
export class ResumoPagamentoService {
  private prisma: PrismaClient;
  private controleJornadaService: ControleJornadaService;

  constructor() {
    this.prisma = new PrismaClient();
    this.controleJornadaService = new ControleJornadaService();
  }

  /**
   * Cria um novo resumo de pagamento
   * Creates a new payment summary
   * @param data Dados do resumo
   * @returns Resumo criado
   */
  async create(data: CreateResumoPagamentoDTO): Promise<any> {
    try {
      return await this.prisma.resumoPagamento.create({
        data: {
          funcionarioId: data.funcionarioId,
          mes: data.mes,
          salarioPrevisto: data.salarioPrevisto,
          salarioReal: data.salarioReal,
          extras: data.extras,
          descontos: data.descontos,
          observacoes: data.observacoes,
          enviadoParaContador: data.enviadoParaContador || false
        },
      });
    } catch (error) {
      console.error('Erro ao criar resumo de pagamento:', error);
      throw new Error('Não foi possível criar o resumo de pagamento');
    }
  }

  /**
   * Atualiza um resumo de pagamento
   * Updates a payment summary
   * @param data Dados atualizados do resumo
   * @returns Resumo atualizado
   */
  async update(data: UpdateResumoPagamentoDTO): Promise<any> {
    try {
      const { id, ...updateData } = data;
      
      return await this.prisma.resumoPagamento.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Erro ao atualizar resumo de pagamento:', error);
      throw new Error('Não foi possível atualizar o resumo de pagamento');
    }
  }

  /**
   * Marca um resumo de pagamento como enviado para o contador
   * Marks a payment summary as sent to the accountant
   * @param id ID do resumo
   * @returns Resumo atualizado
   */
  async marcarComoEnviado(id: string): Promise<any> {
    try {
      return await this.prisma.resumoPagamento.update({
        where: { id },
        data: { enviadoParaContador: true },
      });
    } catch (error) {
      console.error('Erro ao marcar resumo como enviado:', error);
      throw new Error('Não foi possível marcar o resumo como enviado');
    }
  }

  /**
   * Busca um resumo de pagamento pelo ID
   * Finds a payment summary by ID
   * @param id ID do resumo
   * @returns Resumo encontrado ou null
   */
  async findById(id: string): Promise<any | null> {
    try {
      return await this.prisma.resumoPagamento.findUnique({
        where: { id },
        include: {
          funcionario: true
        }
      });
    } catch (error) {
      console.error('Erro ao buscar resumo de pagamento:', error);
      throw new Error('Não foi possível buscar o resumo de pagamento');
    }
  }

  /**
   * Busca um resumo de pagamento pelo funcionário e mês
   * Finds a payment summary by employee and month
   * @param funcionarioId ID do funcionário
   * @param mes Mês no formato MM-YYYY
   * @returns Resumo encontrado ou null
   */
  async findByFuncionarioEMes(funcionarioId: string, mes: string): Promise<any | null> {
    try {
      return await this.prisma.resumoPagamento.findFirst({
        where: {
          funcionarioId,
          mes
        },
        include: {
          funcionario: true
        }
      });
    } catch (error) {
      console.error('Erro ao buscar resumo de pagamento:', error);
      throw new Error('Não foi possível buscar o resumo de pagamento');
    }
  }

  /**
   * Lista todos os resumos de pagamento de um mês
   * Lists all payment summaries for a month
   * @param mes Mês no formato MM-YYYY
   * @returns Lista de resumos
   */
  async findByMes(mes: string): Promise<any[]> {
    try {
      return await this.prisma.resumoPagamento.findMany({
        where: { mes },
        orderBy: { funcionario: { nome: 'asc' } },
        include: {
          funcionario: {
            select: {
              nome: true,
              cargo: true,
              tipoContrato: true,
              status: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar resumos de pagamento:', error);
      throw new Error('Não foi possível listar os resumos de pagamento');
    }
  }

  /**
   * Exclui um resumo de pagamento
   * Deletes a payment summary
   * @param id ID do resumo
   * @returns Resumo excluído
   */
  async delete(id: string): Promise<any> {
    try {
      return await this.prisma.resumoPagamento.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Erro ao excluir resumo de pagamento:', error);
      throw new Error('Não foi possível excluir o resumo de pagamento');
    }
  }

  /**
   * Gera o resumo de pagamento automaticamente com base nas horas trabalhadas
   * Automatically generates a payment summary based on worked hours
   * @param funcionarioId ID do funcionário
   * @param mes Mês no formato MM-YYYY
   * @returns Resumo gerado
   */
  async gerarResumoPagamento(funcionarioId: string, mes: string): Promise<any> {
    try {
      // Verifica se já existe resumo para este funcionário e mês
      // Check if summary already exists for this employee and month
      const resumoExistente = await this.findByFuncionarioEMes(funcionarioId, mes);
      
      if (resumoExistente) {
        throw new Error('Já existe um resumo de pagamento para este funcionário e mês');
      }
      
      // Busca dados do funcionário
      // Get employee data
      const funcionario = await this.prisma.funcionario.findUnique({
        where: { id: funcionarioId }
      });
      
      if (!funcionario) {
        throw new Error('Funcionário não encontrado');
      }
      
      // Calcula horas trabalhadas no mês
      // Calculate worked hours in the month
      const { normal: horasTrabalhadas, extra: horasExtras } = 
        await this.controleJornadaService.calcularHorasMensais(funcionarioId, mes);
      
      // Calcula salário previsto (base mensal)
      // Calculate expected salary (monthly base)
      let salarioPrevisto = funcionario.salarioBruto;
      
      // Calcula salário real com base nas horas trabalhadas
      // Calculate real salary based on worked hours
      let salarioReal = salarioPrevisto;
      let extras = 0;
      
      // Se pagamento por hora, ajusta com base nas horas trabalhadas
      // If payment per hour, adjust based on worked hours
      if (funcionario.pagamentoPorHora) {
        const valorHora = funcionario.salarioBruto / (funcionario.horasSemana * 4); // estimativa mensal
        salarioPrevisto = valorHora * funcionario.horasSemana * 4;
        salarioReal = valorHora * horasTrabalhadas;
        extras = valorHora * horasExtras * 1.5; // horas extras com 50% de adicional
      } else {
        // Para salário fixo, horas extras são calculadas proporcionalmente
        // For fixed salary, overtime is calculated proportionally
        const valorHoraEstimado = funcionario.salarioBruto / (funcionario.horasSemana * 4);
        extras = valorHoraEstimado * horasExtras * 1.5;
      }
      
      // Arredonda para 2 casas decimais
      // Round to 2 decimal places
      salarioPrevisto = parseFloat(salarioPrevisto.toFixed(2));
      salarioReal = parseFloat(salarioReal.toFixed(2));
      extras = parseFloat(extras.toFixed(2));
      
      // Verifica limite para MiniJob (€538)
      // Check MiniJob limit (€538)
      let observacoes = '';
      if (funcionario.tipoContrato === 'Minijob' && (salarioReal + extras) > 538) {
        observacoes = '⚠️ ATENÇÃO: Valor ultrapassa o limite de €538 para MiniJob!';
      }
      
      // Cria o resumo
      // Create the summary
      return await this.create({
        funcionarioId,
        mes,
        salarioPrevisto,
        salarioReal,
        extras,
        observacoes,
        enviadoParaContador: false
      });
    } catch (error) {
      console.error('Erro ao gerar resumo de pagamento:', error);
      throw error;
    }
  }

  /**
   * Gera resumos de pagamento para todos os funcionários ativos
   * Generates payment summaries for all active employees
   * @param mes Mês no formato MM-YYYY
   * @returns Lista de resumos gerados
   */
  async gerarResumoTodosFuncionarios(mes: string): Promise<any[]> {
    try {
      const funcionarios = await this.prisma.funcionario.findMany({
        where: { status: 'ativo' }
      });
      
      const resumos = [];
      
      for (const funcionario of funcionarios) {
        try {
          // Verifica se já existe resumo para este funcionário e mês
          // Check if summary already exists for this employee and month
          const resumoExistente = await this.findByFuncionarioEMes(funcionario.id, mes);
          
          if (!resumoExistente) {
            const resumo = await this.gerarResumoPagamento(funcionario.id, mes);
            resumos.push(resumo);
          }
        } catch (error) {
          console.error(`Erro ao gerar resumo para funcionário ${funcionario.nome}:`, error);
          // Continua para o próximo funcionário
          // Continue to the next employee
        }
      }
      
      return resumos;
    } catch (error) {
      console.error('Erro ao gerar resumos para todos funcionários:', error);
      throw new Error('Não foi possível gerar os resumos de pagamento');
    }
  }
} 