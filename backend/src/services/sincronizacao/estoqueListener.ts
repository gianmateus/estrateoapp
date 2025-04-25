/**
 * Serviço para sincronização de movimentações de estoque com outros módulos
 * Service for synchronizing inventory movements with other modules
 * 
 * Este serviço escuta eventos relacionados ao estoque e atualiza
 * os módulos afetados, como Financeiro e Contador
 * 
 * This service listens to inventory-related events and updates
 * the affected modules, such as Financial and Accounting
 */

import prisma from '../../lib/prisma';
import { EventBus } from '../../lib/EventBus';

export interface MovimentacaoEstoque {
  id: string;
  itemId: string;
  itemNome: string;
  quantidade: number;
  tipo: 'entrada' | 'saida';
  valor: number;
  data: Date;
  responsavel: string;
  [key: string]: any;
}

/**
 * Inicializa os listeners para eventos relacionados ao estoque
 * Initializes listeners for inventory-related events
 */
export function initializeEstoqueListeners() {
  console.log('[EstoqueListener] Inicializando listeners de estoque');
  
  // Ouve evento de movimentação de estoque
  // Listens for inventory movement event
  EventBus.on('estoque.movimentado', async (movimentacao: MovimentacaoEstoque) => {
    console.log('[EstoqueListener] Processando evento estoque.movimentado', movimentacao.id);
    
    try {
      // Atualiza o módulo Financeiro
      await atualizarFinanceiro(movimentacao);
      
      // Notifica o módulo Contador
      await notificarContador(movimentacao);
      
      console.log('[EstoqueListener] Movimentação de estoque sincronizada com sucesso', movimentacao.id);
    } catch (error) {
      console.error('[EstoqueListener] Erro ao sincronizar movimentação de estoque:', error);
    }
  });
  
  // Ouve evento de item abaixo do mínimo
  // Listens for item below minimum stock level event
  EventBus.on('estoque.item.abaixo.minimo', async (item: any) => {
    console.log('[EstoqueListener] Processando evento estoque.item.abaixo.minimo', item.id);
    
    try {
      // Notifica sobre a necessidade de reposição
      await notificarReposicaoNecessaria(item);
      
      console.log('[EstoqueListener] Notificação de estoque baixo enviada com sucesso', item.id);
    } catch (error) {
      console.error('[EstoqueListener] Erro ao notificar sobre estoque baixo:', error);
    }
  });
}

/**
 * Atualiza o módulo Financeiro com dados da movimentação de estoque
 * Updates the Financial module with inventory movement data
 */
async function atualizarFinanceiro(movimentacao: MovimentacaoEstoque) {
  try {
    // Tipo de movimentação financeira baseada no tipo de movimento do estoque
    const tipoFinanceiro = movimentacao.tipo === 'entrada' ? 'despesa' : 'receita';
    
    // Criar registro financeiro da movimentação
    await prisma.financeiro.create({
      data: {
        descricao: `${movimentacao.tipo === 'entrada' ? 'Compra' : 'Saída'} de estoque: ${movimentacao.itemNome}`,
        data: movimentacao.data,
        tipo: tipoFinanceiro,
        categoria: 'estoque',
        valor: movimentacao.valor,
        referenciaId: movimentacao.id
      }
    });
  } catch (error) {
    console.error('[EstoqueListener] Erro ao atualizar financeiro:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre uma movimentação de estoque
 * Notifies the Accounting module about an inventory movement
 */
async function notificarContador(movimentacao: MovimentacaoEstoque) {
  try {
    // Tipo de movimento contábil baseado no tipo de movimento do estoque
    const tipoContabil = movimentacao.tipo === 'entrada' ? 'despesa' : 'receita';
    
    // Criar registro contábil da movimentação
    await prisma.contabilidade.create({
      data: {
        descricao: `${movimentacao.tipo === 'entrada' ? 'Compra' : 'Saída'} de estoque: ${movimentacao.itemNome}`,
        data: movimentacao.data,
        tipo: tipoContabil,
        categoria: 'estoque',
        valor: movimentacao.valor,
        referenciaId: movimentacao.id
      }
    });
  } catch (error) {
    console.error('[EstoqueListener] Erro ao notificar contador:', error);
    throw error;
  }
}

/**
 * Notifica sobre a necessidade de reposição de item abaixo do nível mínimo
 * Notifies about the need to replenish an item below minimum stock level
 */
async function notificarReposicaoNecessaria(item: any) {
  try {
    // Aqui seria implementada a lógica para notificar (por email, sistema, etc)
    // sobre a necessidade de reposição do estoque
    console.log(`[EstoqueListener] Item ${item.nome} está abaixo do nível mínimo (atual: ${item.quantidadeAtual}, mínimo: ${item.quantidadeMinima})`);
    
    // Poderia criar uma notificação no sistema
    // await prisma.notificacao.create({ ... });
    
    // Ou enviar um email
    // await emailService.enviar({ ... });
  } catch (error) {
    console.error('[EstoqueListener] Erro ao notificar reposição necessária:', error);
    throw error;
  }
} 