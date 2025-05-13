/**
 * Tipo para frequência de uso do item
 */
export type FrequenciaUso = 'diaria' | 'semanal' | 'mensal' | 'nenhuma';

/**
 * Tipo para periodicidade de necessidade do estoque
 */
export type PeriodicidadeNecessidade = 'diario' | 'semanal' | 'mensal' | 'trimestral';

/**
 * Interface representando um item do inventário retornado pela API
 */
export interface InventarioItem {
  id: string;
  nome: string;
  categoria: string;
  unidade: string;
  quantidadeAtual: number;
  quantidadeIdeal: number;
  frequencia: FrequenciaUso;
  observacao: string;
  userId: string;
  createdAt: string; // formato ISO 8601
  
  // Novos campos
  codigoSKU?: string;            // Código de barras / SKU do produto
  fornecedor?: string;           // Fornecedor do produto
  precoCusto?: number;           // Preço de custo
  precoVenda?: number;           // Preço de venda
  dataValidade?: string;         // Data de validade para produtos perecíveis
  quantidadeMinima?: number;     // Quantidade mínima para alertas
  localArmazenamento?: string;   // Local de armazenamento (prateleira, depósito, etc.)
  periodicidadeNecessidade?: PeriodicidadeNecessidade; // Periodicidade da necessidade de estoque
  
  estoqueNecessario?: number;    // Campo opcional para cálculo de necessidade
}

/**
 * Interface para criação de item no inventário
 */
export interface InventarioInput {
  nome: string;
  categoria: string;
  unidade: string;
  quantidadeAtual: number;
  quantidadeIdeal: number;
  frequencia: FrequenciaUso;
  observacao: string;
  
  // Novos campos
  codigoSKU?: string;
  fornecedor?: string;
  precoCusto?: number;
  precoVenda?: number;
  dataValidade?: string;
  quantidadeMinima?: number;
  localArmazenamento?: string;
  periodicidadeNecessidade?: PeriodicidadeNecessidade; // Periodicidade da necessidade de estoque
  
  estoqueNecessario?: number;
}

/**
 * Interface para atualização de item no inventário
 */
export interface InventarioUpdateInput extends Partial<InventarioInput> {
  id: string;
}

/**
 * Interface para payload de alerta de estoque mínimo
 */
export interface AlertaEstoqueMinimo {
  id: string;
  nome: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  categoria: string;
  dataAlerta: string;
}

/**
 * Interface para payload de alerta de produto próximo à validade
 */
export interface AlertaProximoValidade {
  id: string;
  nome: string;
  dataValidade: string;
  diasRestantes: number;
  categoria: string;
  dataAlerta: string;
}

/**
 * Interface para payload de alerta de produto vencido
 */
export interface AlertaProdutoVencido {
  id: string;
  nome: string;
  dataValidade: string;
  diasVencido: number;
  categoria: string;
  dataAlerta: string;
} 