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
 * Union type com todos os tipos de payload possíveis
 */
export type EventPayload = 
  | FeriasRegistradasPayload
  | PagamentoCriadoPayload
  | EstoqueAtualizadoPayload
  | AusenciaRegistradaPayload
  | FolgaRegistradaPayload
  | SincronizacaoPayload; 