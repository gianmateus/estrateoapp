/**
 * Tipos de eventos do sistema
 * @module EventTypes
 */

import { EventName as EventNameType } from '../constants/events';

// Re-exporta o tipo EventName
export type EventName = keyof EventPayloadMap;

/**
 * Interface base para todos os payloads de eventos
 */
export interface BaseEventPayload {
  timestamp: string;
  source: string;
  metadata?: Record<string, unknown>;
}

/**
 * Payload para evento de férias registradas
 */
export interface FeriasRegistradasPayload extends BaseEventPayload {
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: string; // formato ISO
  dataFim: string;    // formato ISO
}

/**
 * Payload para evento de pagamento criado
 */
export interface PagamentoCriadoPayload extends BaseEventPayload {
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
export interface EstoqueItemAbaixoMinimoPayload extends BaseEventPayload {
  id: string;
  nome: string;
  quantidade: number;
  minimo: number;
  categoria?: string;
}

/**
 * Payload para evento de item próximo do vencimento
 */
export interface EstoqueItemProximoVencimentoPayload extends BaseEventPayload {
  id: string;
  nome: string;
  dataValidade: string;
  diasRestantes: number;
  categoria?: string;
}

/**
 * Payload para evento de item vencido
 */
export interface EstoqueItemVencidoPayload extends BaseEventPayload {
  id: string;
  nome: string;
  dataValidade: string;
  diasVencido?: number;
  categoria?: string;
}

/**
 * Payload para evento de item de estoque adicionado
 */
export interface EstoqueItemAdicionadoPayload extends BaseEventPayload {
  id: string;
  nome: string;
  quantidade: number;
  categoria?: string;
}

/**
 * Payload para evento de item de estoque atualizado
 */
export interface EstoqueItemAtualizadoPayload extends BaseEventPayload {
  id: string;
  anterior: Record<string, unknown>;
  atual: Record<string, unknown>;
}

/**
 * Payload para evento de item de estoque removido
 */
export interface EstoqueItemRemovidoPayload extends BaseEventPayload {
  id: string;
  nome: string;
}

/**
 * Payload para evento de ausência registrada
 */
export interface AusenciaRegistradaPayload extends BaseEventPayload {
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
export interface SincronizacaoPayload extends BaseEventPayload {
  tipo: 'inicio' | 'fim' | 'erro';
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
export interface ImpostoVencimentoProximoPayload extends BaseEventPayload {
  id: string;
  tipo: string;
  nome: string;
  dataVencimento: string;
  diasRestantes: number;
  valor: number;
  paisAplicacao: string;
}

/**
 * Payload para evento de novo imposto registrado
 */
export interface ImpostoNovoRegistradoPayload extends BaseEventPayload {
  id: string;
  tipo: string;
  nome: string;
  aliquota: number;
  periodicidade: string;
  paisAplicacao: string;
}

/**
 * Payload para evento de imposto pago
 */
export interface ImpostoPagoPayload extends BaseEventPayload {
  id: string;
  tipo: string;
  nome: string;
  valorPago: number;
  dataPagamento: string;
  referencia: string;
  paisAplicacao: string;
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

/**
 * Mapa de tipos para os eventos do sistema
 */
export interface EventPayloadMap {
  // Eventos de Férias
  'ferias.registradas': {
    funcionarioId: string;
    funcionarioNome: string;
    dataInicio: string;
    dataFim: string;
    metadata?: {
      motivo?: string;
      aprovadoPor?: string;
      [key: string]: any;
    };
  };
  'ferias.aprovadas': {
    funcionarioId: string;
    funcionarioNome: string;
    dataInicio: string;
    dataFim: string;
    aprovadoPor: string;
    metadata?: {
      [key: string]: any;
    };
  };
  'ferias.rejeitadas': {
    funcionarioId: string;
    funcionarioNome: string;
    motivo: string;
    rejeitadoPor: string;
    metadata?: {
      [key: string]: any;
    };
  };

  // Eventos de Estoque
  'estoque.item.abaixo.minimo': {
    id: string;
    nome: string;
    quantidade: number;
    minimo: number;
    categoria?: string;
  };
  'estoque.item.proximo.vencimento': {
    id: string;
    nome: string;
    dataValidade: string;
    diasRestantes: number;
    categoria?: string;
  };
  'estoque.item.vencido': {
    id: string;
    nome: string;
    dataValidade: string;
    diasVencido?: number;
    categoria?: string;
  };
  'estoque.item.adicionado': {
    id: string;
    nome: string;
    quantidade: number;
    categoria?: string;
  };
  'estoque.item.atualizado': {
    id: string;
    nome: string;
    anterior: Record<string, unknown>;
    atual: Record<string, unknown>;
  };
  'estoque.item.removido': {
    id: string;
    nome: string;
  };

  // Eventos de Pagamento
  'pagamento.criado': {
    id: string;
    valor: number;
    data: string;
    categoria: string;
  };
  'pagamento.atualizado': {
    id: string;
    valor: number;
    data: string;
    categoria: string;
  };
  'pagamento.excluido': {
    id: string;
  };

  // Eventos de Sincronização
  'sincronizacao.inicio': {
    tipo: 'inicio';
    detalhes?: string;
  };
  'sincronizacao.fim': {
    tipo: 'fim';
    detalhes?: string;
  };
  'sincronizacao.erro': {
    tipo: 'erro';
    detalhes: string;
  };

  // Eventos de Impostos
  'imposto.vencimento.proximo': {
    id: string;
    tipo: string;
    nome: string;
    dataVencimento: string;
    diasRestantes: number;
    valor: number;
    paisAplicacao: string;
  };
  'imposto.novo.registrado': {
    id: string;
    tipo: string;
    nome: string;
    aliquota: number;
    periodicidade: string;
    paisAplicacao: string;
  };
  'imposto.pago': {
    id: string;
    tipo: string;
    nome: string;
    valorPago: number;
    dataPagamento: string;
    referencia: string;
    paisAplicacao: string;
  };

  // Eventos de Ausência
  'ausencia.registrada': {
    funcionarioId: string;
    funcionarioNome: string;
    tipo: 'doença' | 'pessoal' | 'outro';
    dataInicio: string;
    dataFim: string;
    motivo?: string;
  };

  // Eventos de Folga
  'folga.registrada': {
    funcionarioId: string;
    funcionarioNome: string;
    data: string;
    tipo: 'folga' | 'feriado' | 'recesso';
  };

  // Eventos de Entrada
  'entrada.criada': {
    id: string;
    valor: number;
    data: string;
    categoria: string;
  };
  'entrada.atualizada': {
    id: string;
    valor: number;
    data: string;
    categoria: string;
  };
  'entrada.excluida': {
    id: string;
  };
  'entrada.parcelada.criada': {
    id: string;
    valor: number;
    parcelas: number;
    data: string;
    categoria: string;
  };
  'entrada.parcelada.atualizada': {
    id: string;
    valor: number;
    parcelas: number;
    data: string;
    categoria: string;
  };
  'entrada.parcela.paga': {
    id: string;
    parcelaId: string;
    valor: number;
    data: string;
  };

  // Eventos de Saída
  'saida.criada': {
    id: string;
    valor: number;
    data: string;
    categoria: string;
  };
  'saida.atualizada': {
    id: string;
    valor: number;
    data: string;
    categoria: string;
  };
  'saida.excluida': {
    id: string;
  };
  'saida.parcelada.criada': {
    id: string;
    valor: number;
    parcelas: number;
    data: string;
    categoria: string;
  };
  'saida.parcelada.atualizada': {
    id: string;
    valor: number;
    parcelas: number;
    data: string;
    categoria: string;
  };
  'saida.parcela.paga': {
    id: string;
    parcelaId: string;
    valor: number;
    data: string;
  };

  // Eventos de Funcionário
  'funcionario.pagamento.realizado': {
    funcionarioId: string;
    funcionarioNome: string;
    valor: number;
    data: string;
    tipo: string;
  };
  'funcionario.pagamento.cancelado': {
    funcionarioId: string;
    funcionarioNome: string;
    valor: number;
    data: string;
    tipo: string;
    motivo: string;
  };
  'funcionario.salario.pago': {
    funcionarioId: string;
    funcionarioNome: string;
    valor: number;
    data: string;
    mes: string;
    ano: string;
  };

  // Eventos de Relatório
  'relatorio.mensal.gerado': {
    id: string;
    mes: string;
    ano: string;
    tipo: string;
    url: string;
  };

  // Eventos de Nota Fiscal
  'notaFiscal.gerada': {
    id: string;
    numero: string;
    valor: number;
    data: string;
    tipo: string;
    url: string;
  };
}

/**
 * Tipo para o callback de eventos
 */
export type EventCallback<T extends EventName> = (payload: EventPayloadMap[T]) => void; 