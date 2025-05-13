/**
 * Adaptadores para conversão entre os tipos de inventário usados em diferentes partes da aplicação
 */
import { ItemInventario } from '../contexts/InventarioContext';

// Interface para os itens do inventário usada na página Inventario.tsx
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  category?: string;
  minQuantity?: number;
  expirationDate?: string;
  unitCost?: number;
  periodicity?: 'diario' | 'semanal' | 'mensal' | 'trimestral';
}

/**
 * Converte um array de InventoryItem para array de ItemInventario
 */
export const convertToItemInventario = (items: InventoryItem[]): ItemInventario[] => {
  return items.map(item => ({
    id: item.id,
    nome: item.name,
    quantidade: item.quantity,
    unidadeMedida: item.unit,
    preco: 0, // Valor padrão, se necessário ajustar conforme a lógica do app
    nivelMinimoEstoque: item.minQuantity,
    descricao: item.notes,
    categoria: item.category,
    dataValidade: item.expirationDate,
    precoCompra: item.unitCost,
    periodicidadeNecessidade: item.periodicity || 'semanal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

/**
 * Converte um array de ItemInventario para array de InventoryItem
 */
export const convertToInventoryItem = (items: ItemInventario[]): InventoryItem[] => {
  return items.map(item => ({
    id: item.id,
    name: item.nome,
    quantity: item.quantidade,
    unit: item.unidadeMedida,
    notes: item.descricao,
    category: item.categoria,
    minQuantity: item.nivelMinimoEstoque,
    expirationDate: item.dataValidade?.toString(),
    unitCost: item.precoCompra,
    periodicity: item.periodicidadeNecessidade
  }));
}; 