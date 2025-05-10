/**
 * Tipos para o módulo de Funcionários
 */

// Tipo de contrato de trabalho
export type TipoContrato = 'Minijob' | 'Teilzeit' | 'Vollzeit' | 'Freelancer';

// Status do funcionário
export type Status = 'ativo' | 'inativo';

// Situação atual do funcionário
export type SituacaoAtual = 'ativo' | 'ferias' | 'afastado' | 'desligado';

// Forma de pagamento
export type FormaPagamento = 'mensal' | 'hora' | 'comissao';

// Dias da semana
export type DiaSemana = 'segunda' | 'terça' | 'quarta' | 'quinta' | 'sexta' | 'sábado' | 'domingo';

// Interface para funcionário
export interface Funcionario {
  id?: string;
  nome: string;
  cargo: string;
  tipoContrato: TipoContrato;
  dataAdmissao: Date;
  salarioBruto: number;
  pagamentoPorHora: boolean;
  horasSemana: number;
  diasTrabalho: DiaSemana[];
  iban?: string;
  status: Status;
  observacoes?: string;
  formaPagamento?: FormaPagamento;
  situacaoAtual?: SituacaoAtual;
  telefone?: string;
  email?: string;
}

// Interface para filtros de listagem de funcionários
export interface FuncionarioFilters {
  nome?: string;
  cargo?: string;
  tipoContrato?: TipoContrato;
  status?: Status;
  situacaoAtual?: SituacaoAtual;
  formaPagamento?: FormaPagamento;
} 