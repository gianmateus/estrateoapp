/**
 * Tipos para o módulo de Funcionários
 * Types for the Employees module
 */

// Tipo de contrato de trabalho
// Employment contract type
export type TipoContrato = 'Minijob' | 'Teilzeit' | 'Vollzeit' | 'Freelancer';

// Status do funcionário
// Employee status
export type Status = 'ativo' | 'inativo';

// Dias da semana
// Days of the week
export type DiaSemana = 'segunda' | 'terça' | 'quarta' | 'quinta' | 'sexta' | 'sábado' | 'domingo';

// Interface para criação de funcionário
// Employee creation interface
export interface CreateFuncionarioDTO {
  nome: string;
  cargo: string;
  tipoContrato: TipoContrato;
  dataAdmissao: Date;
  salarioBruto: number;
  pagamentoPorHora: boolean;
  horasSemana: number;
  diasTrabalho: DiaSemana[];
  iban?: string;
  observacoes?: string;
  contratoUploadUrl?: string;
}

// Interface para atualização de funcionário
// Employee update interface
export interface UpdateFuncionarioDTO extends Partial<CreateFuncionarioDTO> {
  id: string;
  status?: Status;
}

// Interface para criação de registro de jornada
// Workday record creation interface
export interface CreateControleJornadaDTO {
  funcionarioId: string;
  data: Date;
  horaEntrada: string; // formato HH:mm
  horaSaida: string; // formato HH:mm
  horasTrabalhadas: number;
  horaExtra?: number;
  faltaJustificada: boolean;
  observacoes?: string;
}

// Interface para atualização de registro de jornada
// Workday record update interface
export interface UpdateControleJornadaDTO extends Partial<CreateControleJornadaDTO> {
  id: string;
}

// Interface para criação de resumo de pagamento
// Payment summary creation interface
export interface CreateResumoPagamentoDTO {
  funcionarioId: string;
  mes: string; // formato MM-YYYY
  salarioPrevisto: number;
  salarioReal: number;
  extras?: number;
  descontos?: number;
  observacoes?: string;
  enviadoParaContador?: boolean;
}

// Interface para atualização de resumo de pagamento
// Payment summary update interface
export interface UpdateResumoPagamentoDTO extends Partial<CreateResumoPagamentoDTO> {
  id: string;
}

// Filtros para listagem de funcionários
// Employee listing filters
export interface FuncionarioFilters {
  nome?: string;
  cargo?: string;
  tipoContrato?: TipoContrato;
  status?: Status;
} 