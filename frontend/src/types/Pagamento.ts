/**
 * Interface representando um pagamento retornado pela API
 */
export interface Pagamento {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  vencimento: string; // formato ISO 8601
  pago: boolean;
  userId: string;
  createdAt: string; // formato ISO 8601
}

/**
 * Interface para criação de pagamento
 */
export interface PagamentoInput {
  descricao: string;
  valor: number;
  categoria: string;
  vencimento: string; // formato ISO 8601
  pago?: boolean;
}

/**
 * Interface para atualização de pagamento
 */
export interface PagamentoUpdateInput extends PagamentoInput {
  id: string;
} 