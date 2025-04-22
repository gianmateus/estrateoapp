/**
 * Tipo para frequência de uso do item
 */
export type FrequenciaUso = 'diaria' | 'semanal' | 'mensal' | 'nenhuma';

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
  estoqueNecessario?: number; // Campo opcional para cálculo de necessidade
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
  estoqueNecessario?: number;
}

/**
 * Interface para atualização de item no inventário
 */
export interface InventarioUpdateInput extends Partial<InventarioInput> {
  id: string;
} 