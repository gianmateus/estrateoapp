/**
 * Constantes para os eventos do sistema
 * Segue o padrão de nomenclatura: dominio.acao
 */

// Eventos de Férias
export const FERIAS_EVENTS = {
  REGISTRADAS: 'ferias.registradas',
  APROVADAS: 'ferias.aprovadas',
  REJEITADAS: 'ferias.rejeitadas'
} as const;

// Eventos de Estoque
export const ESTOQUE_EVENTS = {
  ITEM_ABAIXO_MINIMO: 'estoque.item.abaixo.minimo',
  ITEM_PROXIMO_VENCIMENTO: 'estoque.item.proximo.vencimento',
  ITEM_VENCIDO: 'estoque.item.vencido',
  ITEM_ADICIONADO: 'estoque.item.adicionado',
  ITEM_ATUALIZADO: 'estoque.item.atualizado',
  ITEM_REMOVIDO: 'estoque.item.removido'
} as const;

// Eventos de Pagamento
export const PAGAMENTO_EVENTS = {
  CRIADO: 'pagamento.criado',
  ATUALIZADO: 'pagamento.atualizado',
  EXCLUIDO: 'pagamento.excluido'
} as const;

// Eventos de Sincronização
export const SINCRONIZACAO_EVENTS = {
  INICIO: 'sincronizacao.inicio',
  FIM: 'sincronizacao.fim',
  ERRO: 'sincronizacao.erro'
} as const;

// Eventos de Impostos
export const IMPOSTO_EVENTS = {
  VENCIMENTO_PROXIMO: 'imposto.vencimento.proximo',
  NOVO_REGISTRADO: 'imposto.novo.registrado',
  PAGO: 'imposto.pago'
} as const;

// Eventos de Ausência
export const AUSENCIA_EVENTS = {
  REGISTRADA: 'ausencia.registrada'
} as const;

// Eventos de Folga
export const FOLGA_EVENTS = {
  REGISTRADA: 'folga.registrada'
} as const;

// Eventos de Entrada
export const ENTRADA_EVENTS = {
  CRIADA: 'entrada.criada',
  ATUALIZADA: 'entrada.atualizada',
  EXCLUIDA: 'entrada.excluida',
  PARCELADA_CRIADA: 'entrada.parcelada.criada',
  PARCELADA_ATUALIZADA: 'entrada.parcelada.atualizada',
  PARCELA_PAGA: 'entrada.parcela.paga'
} as const;

// Eventos de Saída
export const SAIDA_EVENTS = {
  CRIADA: 'saida.criada',
  ATUALIZADA: 'saida.atualizada',
  EXCLUIDA: 'saida.excluida',
  PARCELADA_CRIADA: 'saida.parcelada.criada',
  PARCELADA_ATUALIZADA: 'saida.parcelada.atualizada',
  PARCELA_PAGA: 'saida.parcela.paga'
} as const;

// Eventos de Funcionário
export const FUNCIONARIO_EVENTS = {
  PAGAMENTO_REALIZADO: 'funcionario.pagamento.realizado',
  PAGAMENTO_CANCELADO: 'funcionario.pagamento.cancelado',
  SALARIO_PAGO: 'funcionario.salario.pago'
} as const;

// Eventos de Relatório
export const RELATORIO_EVENTS = {
  MENSAL_GERADO: 'relatorio.mensal.gerado'
} as const;

// Eventos de Nota Fiscal
export const NOTA_FISCAL_EVENTS = {
  GERADA: 'notaFiscal.gerada'
} as const;

// Exporta todos os eventos como um objeto único
export const EVENTS = {
  ...FERIAS_EVENTS,
  ...ESTOQUE_EVENTS,
  ...PAGAMENTO_EVENTS,
  ...SINCRONIZACAO_EVENTS,
  ...IMPOSTO_EVENTS,
  ...AUSENCIA_EVENTS,
  ...FOLGA_EVENTS,
  ...ENTRADA_EVENTS,
  ...SAIDA_EVENTS,
  ...FUNCIONARIO_EVENTS,
  ...RELATORIO_EVENTS,
  ...NOTA_FISCAL_EVENTS
} as const;

// Tipo para todos os nomes de eventos
export type EventName = typeof EVENTS[keyof typeof EVENTS]; 