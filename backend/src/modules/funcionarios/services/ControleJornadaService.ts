import { PrismaClient } from '@prisma/client';
import { 
  CreateControleJornadaDTO,
  UpdateControleJornadaDTO
} from '../models/funcionarioTypes';

/**
 * Serviço para gerenciar o controle de jornada de trabalho
 * Service to manage work day records
 */
export class ControleJornadaService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Cria um novo registro de jornada
   * Creates a new work day record
   * @param data Dados do registro
   * @returns Registro criado
   */
  async create(data: CreateControleJornadaDTO): Promise<any> {
    try {
      // Calcula as horas trabalhadas se não forem fornecidas
      // Calculate worked hours if not provided
      let horasTrabalhadas = data.horasTrabalhadas;
      
      if (!horasTrabalhadas && data.horaEntrada && data.horaSaida) {
        horasTrabalhadas = this.calcularHorasTrabalhadas(data.horaEntrada, data.horaSaida);
      }

      return await this.prisma.controleJornada.create({
        data: {
          funcionarioId: data.funcionarioId,
          data: data.data,
          horaEntrada: data.horaEntrada,
          horaSaida: data.horaSaida,
          horasTrabalhadas: horasTrabalhadas,
          horaExtra: data.horaExtra,
          faltaJustificada: data.faltaJustificada,
          observacoes: data.observacoes
        },
      });
    } catch (error) {
      console.error('Erro ao criar registro de jornada:', error);
      throw new Error('Não foi possível criar o registro de jornada');
    }
  }

  /**
   * Atualiza um registro de jornada
   * Updates a work day record
   * @param data Dados atualizados do registro
   * @returns Registro atualizado
   */
  async update(data: UpdateControleJornadaDTO): Promise<any> {
    try {
      const { id, ...updateData } = data;
      
      // Recalcula horas trabalhadas se entrada ou saída foram alteradas
      // Recalculate worked hours if entry or exit times were changed
      if (updateData.horaEntrada || updateData.horaSaida) {
        const registro = await this.prisma.controleJornada.findUnique({
          where: { id }
        });
        
        if (registro) {
          const entrada = updateData.horaEntrada || registro.horaEntrada;
          const saida = updateData.horaSaida || registro.horaSaida;
          updateData.horasTrabalhadas = this.calcularHorasTrabalhadas(entrada, saida);
        }
      }
      
      return await this.prisma.controleJornada.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Erro ao atualizar registro de jornada:', error);
      throw new Error('Não foi possível atualizar o registro de jornada');
    }
  }

  /**
   * Busca um registro de jornada pelo ID
   * Finds a work day record by ID
   * @param id ID do registro
   * @returns Registro encontrado ou null
   */
  async findById(id: string): Promise<any | null> {
    try {
      return await this.prisma.controleJornada.findUnique({
        where: { id },
        include: {
          funcionario: true
        }
      });
    } catch (error) {
      console.error('Erro ao buscar registro de jornada:', error);
      throw new Error('Não foi possível buscar o registro de jornada');
    }
  }

  /**
   * Lista todos os registros de jornada de um funcionário
   * Lists all work day records for an employee
   * @param funcionarioId ID do funcionário
   * @param mes Mês no formato MM-YYYY (opcional)
   * @returns Lista de registros
   */
  async findByFuncionarioId(funcionarioId: string, mes?: string): Promise<any[]> {
    try {
      const where: any = { funcionarioId };
      
      // Filtra por mês se fornecido
      // Filter by month if provided
      if (mes) {
        const [month, year] = mes.split('-');
        const startDate = new Date(`${year}-${month}-01`);
        
        // Último dia do mês
        // Last day of month
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        const endDate = new Date(`${year}-${month}-${lastDay}`);
        
        where.data = {
          gte: startDate,
          lte: endDate
        };
      }
      
      return await this.prisma.controleJornada.findMany({
        where,
        orderBy: { data: 'desc' },
        include: {
          funcionario: {
            select: {
              nome: true,
              cargo: true,
              horasSemana: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar registros de jornada:', error);
      throw new Error('Não foi possível listar os registros de jornada');
    }
  }

  /**
   * Exclui um registro de jornada
   * Deletes a work day record
   * @param id ID do registro
   * @returns Registro excluído
   */
  async delete(id: string): Promise<any> {
    try {
      return await this.prisma.controleJornada.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Erro ao excluir registro de jornada:', error);
      throw new Error('Não foi possível excluir o registro de jornada');
    }
  }

  /**
   * Calcula as horas trabalhadas a partir do horário de entrada e saída
   * Calculates worked hours from entry and exit times
   * @param entrada Horário de entrada (HH:mm)
   * @param saida Horário de saída (HH:mm)
   * @returns Horas trabalhadas (número decimal)
   */
  private calcularHorasTrabalhadas(entrada: string, saida: string): number {
    try {
      const [entradaHora, entradaMinuto] = entrada.split(':').map(Number);
      const [saidaHora, saidaMinuto] = saida.split(':').map(Number);
      
      // Calcula a diferença em minutos
      // Calculate difference in minutes
      let diferencaMinutos = (saidaHora * 60 + saidaMinuto) - (entradaHora * 60 + entradaMinuto);
      
      // Se o resultado for negativo, assume que passou da meia-noite
      // If result is negative, assume it passed midnight
      if (diferencaMinutos < 0) {
        diferencaMinutos += 24 * 60;
      }
      
      // Converte para horas decimais
      // Convert to decimal hours
      return parseFloat((diferencaMinutos / 60).toFixed(2));
    } catch (error) {
      console.error('Erro ao calcular horas trabalhadas:', error);
      return 0;
    }
  }

  /**
   * Calcula o total de horas trabalhadas por um funcionário em um mês
   * Calculates total hours worked by an employee in a month
   * @param funcionarioId ID do funcionário
   * @param mes Mês no formato MM-YYYY
   * @returns Total de horas normais e extras
   */
  async calcularHorasMensais(funcionarioId: string, mes: string): Promise<{ normal: number, extra: number }> {
    try {
      const registros = await this.findByFuncionarioId(funcionarioId, mes);
      
      let totalHoras = 0;
      let totalExtra = 0;
      
      registros.forEach((registro) => {
        totalHoras += registro.horasTrabalhadas || 0;
        totalExtra += registro.horaExtra || 0;
      });
      
      return {
        normal: parseFloat(totalHoras.toFixed(2)),
        extra: parseFloat(totalExtra.toFixed(2))
      };
    } catch (error) {
      console.error('Erro ao calcular horas mensais:', error);
      throw new Error('Não foi possível calcular as horas mensais');
    }
  }
} 