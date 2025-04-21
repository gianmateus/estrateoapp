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
  userId: string;
  createdAt: string; // formato ISO 8601
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
}

/**
 * Interface para atualização de item no inventário
 */
export interface InventarioUpdateInput extends Partial<InventarioInput> {
  id: string;
} 