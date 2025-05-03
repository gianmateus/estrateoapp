/**
 * Tipos de eventos do sistema
 * @module EventTypes
 */

/**
 * Payload para evento de férias registradas
 */
export interface FeriasRegistradasPayload {
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: string; // formato ISO
  dataFim: string;    // formato ISO
}

/**
 * Payload para evento de pagamento criado
 */
export interface PagamentoCriadoPayload {
  id: string;
  valor: number;
  data: string;
  categoria: string;
}

/**
 * Payload para evento de estoque atualizado
 */
export interface EstoqueAtualizadoPayload {
  produtoId: string;
  quantidade: number;
  tipo: 'entrada' | 'saida';
  data: string;
}

/**
 * Payload para evento de item abaixo do mínimo
 */
export interface EstoqueItemAbaixoMinimoPayload {
  id: string;
  nome: string;
  quantidade: number;
  minimo: number;
  categoria?: string;
  dataOcorrencia?: string;
}

/**
 * Payload para evento de item próximo do vencimento
 */
export interface EstoqueItemProximoVencimentoPayload {
  id: string;
  nome: string;
  dataValidade: string;
  diasRestantes: number;
  categoria?: string;
  dataOcorrencia?: string;
}

/**
 * Payload para evento de item vencido
 */
export interface EstoqueItemVencidoPayload {
  id: string;
  nome: string;
  dataValidade: string;
  diasVencido?: number;
  categoria?: string;
  dataOcorrencia?: string;
}

/**
 * Payload para evento de item de estoque adicionado
 */
export interface EstoqueItemAdicionadoPayload {
  id: string;
  nome: string;
  quantidade: number;
  categoria?: string;
  dataOcorrencia?: string;
}

/**
 * Payload para evento de item de estoque atualizado
 */
export interface EstoqueItemAtualizadoPayload {
  id: string;
  anterior: any;
  atual: any;
  dataOcorrencia?: string;
}

/**
 * Payload para evento de item de estoque removido
 */
export interface EstoqueItemRemovidoPayload {
  id: string;
  nome: string;
  dataOcorrencia?: string;
}

/**
 * Payload para evento de ausência registrada
 */
export interface AusenciaRegistradaPayload {
  funcionarioId: string;
  funcionarioNome: string;
  tipo: 'doença' | 'pessoal' | 'outro';
  dataInicio: string;
  dataFim: string;
  motivo?: string;
}

/**
 * Payload para evento de folga registrada
 */
export interface FolgaRegistradaPayload {
  funcionarioId: string;
  funcionarioNome: string;
  data: string;
  tipo: 'folga' | 'feriado' | 'recesso';
}

/**
 * Payload para evento de sincronização
 */
export interface SincronizacaoPayload {
  tipo: 'inicio' | 'fim' | 'erro';
  timestamp: string;
  detalhes?: string;
}

/**
 * Payload para evento de declaração de imposto pendente
 */
export interface ImpostoDeclaracaoPendentePayload {
  id: string;
  tipo: string;
  nome: string;
  dataVencimento: string;
  diasRestantes: number;
  valor: number;
  paisAplicacao: string;
  dataOcorrencia?: string;
}

/**
 * Payload para evento de imposto com vencimento próximo
 */
export interface ImpostoVencimentoProximoPayload {
  id: string;
  tipo: string;
  nome: string;
  dataVencimento: string;
  diasRestantes: number;
  valor: number;
  paisAplicacao: string;
  dataOcorrencia?: string;
}

/**
 * Payload para evento de novo imposto registrado
 */
export interface ImpostoNovoRegistradoPayload {
  id: string;
  tipo: string;
  nome: string;
  aliquota: number;
  periodicidade: string;
  paisAplicacao: string;
  dataOcorrencia?: string;
}

/**
 * Payload para evento de imposto pago
 */
export interface ImpostoPagoPayload {
  id: string;
  tipo: string;
  nome: string;
  valorPago: number;
  dataPagamento: string;
  referencia: string;
  paisAplicacao: string;
  dataOcorrencia?: string;
}

/**
 * Union type com todos os tipos de payload possíveis
 */
export type EventPayload = 
  | FeriasRegistradasPayload
  | PagamentoCriadoPayload
  | EstoqueAtualizadoPayload
  | EstoqueItemAbaixoMinimoPayload
  | EstoqueItemProximoVencimentoPayload
  | EstoqueItemVencidoPayload
  | EstoqueItemAdicionadoPayload
  | EstoqueItemAtualizadoPayload
  | EstoqueItemRemovidoPayload
  | AusenciaRegistradaPayload
  | FolgaRegistradaPayload
  | SincronizacaoPayload
  | ImpostoDeclaracaoPendentePayload
  | ImpostoVencimentoProximoPayload
  | ImpostoNovoRegistradoPayload
  | ImpostoPagoPayload; 