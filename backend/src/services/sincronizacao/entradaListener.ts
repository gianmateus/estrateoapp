/**
 * Serviço para sincronização de entradas com outros módulos
 * Service for synchronizing income entries with other modules
 * 
 * Este serviço escuta eventos relacionados a entradas financeiras e atualiza
 * os módulos afetados, como Contador, Financeiro e Relatórios
 * 
 * This service listens to income-related events and updates
 * the affected modules, such as Accounting, Financial, and Reports
 */

import prisma from '../../lib/prisma';
import { EventBus } from '../../lib/EventBus';

export interface Entrada {
  id: string;
  descricao: string;
  valor: number;
  data: Date;
  categoria: string;
  fonte: string;
  [key: string]: any;
}

/**
 * Inicializa os listeners para eventos relacionados a entradas
 * Initializes listeners for income-related events
 */
export function initializeEntradaListeners() {
  console.log('[EntradaListener] Inicializando listeners de entradas');
  
  // Ouve evento de criação de entrada
  // Listens for income creation event
  EventBus.on('entrada.criada', async (entrada: Entrada) => {
    console.log('[EntradaListener] Processando evento entrada.criada', entrada.id);
    
    try {
      // Atualiza o módulo Financeiro
      await atualizarFinanceiro(entrada);
      
      // Notifica o módulo Contador
      await notificarContador(entrada);
      
      // Atualiza relatórios
      await atualizarRelatorios(entrada);
      
      console.log('[EntradaListener] Entrada sincronizada com sucesso', entrada.id);
    } catch (error) {
      console.error('[EntradaListener] Erro ao sincronizar entrada:', error);
    }
  });
  
  // Ouve evento de atualização de entrada
  // Listens for income update event
  EventBus.on('entrada.atualizada', async (entrada: Entrada) => {
    console.log('[EntradaListener] Processando evento entrada.atualizada', entrada.id);
    
    try {
      // Atualiza o módulo Financeiro
      await atualizarFinanceiro(entrada, true);
      
      // Notifica o módulo Contador
      await notificarContador(entrada, true);
      
      // Atualiza relatórios
      await atualizarRelatorios(entrada, true);
      
      console.log('[EntradaListener] Atualização de entrada sincronizada com sucesso', entrada.id);
    } catch (error) {
      console.error('[EntradaListener] Erro ao sincronizar atualização de entrada:', error);
    }
  });
  
  // Ouve evento de exclusão de entrada
  // Listens for income deletion event
  EventBus.on('entrada.excluida', async (entradaId: string) => {
    console.log('[EntradaListener] Processando evento entrada.excluida', entradaId);
    
    try {
      // Remove do Financeiro
      await removerDoFinanceiro(entradaId);
      
      // Notifica o módulo Contador sobre a exclusão
      await notificarContadorSobreExclusao(entradaId);
      
      // Atualiza relatórios após exclusão
      await atualizarRelatoriosAposExclusao(entradaId);
      
      console.log('[EntradaListener] Exclusão de entrada sincronizada com sucesso', entradaId);
    } catch (error) {
      console.error('[EntradaListener] Erro ao sincronizar exclusão de entrada:', error);
    }
  });
}

/**
 * Atualiza o módulo Financeiro com dados da entrada
 * Updates the Financial module with income data
 */
async function atualizarFinanceiro(entrada: Entrada, isUpdate = false) {
  try {
    // Verifica se já existe um registro financeiro para esta entrada
    const registroExistente = await prisma.financeiro.findFirst({
      where: {
        referenciaId: entrada.id,
        tipo: 'receita'
      }
    });
    
    if (isUpdate && registroExistente) {
      // Atualiza o registro existente
      await prisma.financeiro.update({
        where: { id: registroExistente.id },
        data: {
          descricao: entrada.descricao,
          data: entrada.data,
          valor: entrada.valor,
          categoria: entrada.categoria
        }
      });
    } else if (!registroExistente) {
      // Cria um novo registro financeiro
      await prisma.financeiro.create({
        data: {
          descricao: entrada.descricao,
          data: entrada.data,
          tipo: 'receita',
          valor: entrada.valor,
          categoria: entrada.categoria,
          referenciaId: entrada.id
        }
      });
    }
  } catch (error) {
    console.error('[EntradaListener] Erro ao atualizar financeiro:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre uma nova entrada ou atualização
 * Notifies the Accounting module about a new income or update
 */
async function notificarContador(entrada: Entrada, isUpdate = false) {
  try {
    // Verifica se já existe um registro contábil para esta entrada
    const registroExistente = await prisma.contabilidade.findFirst({
      where: {
        referenciaId: entrada.id,
        tipo: 'receita'
      }
    });
    
    if (isUpdate && registroExistente) {
      // Atualiza o registro existente
      await prisma.contabilidade.update({
        where: { id: registroExistente.id },
        data: {
          descricao: entrada.descricao,
          data: entrada.data,
          valor: entrada.valor,
          categoria: entrada.categoria
        }
      });
    } else if (!registroExistente) {
      // Cria um novo registro contábil
      await prisma.contabilidade.create({
        data: {
          descricao: entrada.descricao,
          data: entrada.data,
          tipo: 'receita',
          categoria: entrada.categoria,
          valor: entrada.valor,
          referenciaId: entrada.id
        }
      });
    }
  } catch (error) {
    console.error('[EntradaListener] Erro ao notificar contador:', error);
    throw error;
  }
}

/**
 * Atualiza relatórios com base na nova entrada ou atualização
 * Updates reports based on new income or update
 */
async function atualizarRelatorios(entrada: Entrada, isUpdate = false) {
  try {
    // Aqui seria implementada a lógica para atualizar relatórios
    // A implementação específica dependerá da estrutura do sistema de relatórios
    console.log('[EntradaListener] Relatórios atualizados para entrada:', entrada.id);
  } catch (error) {
    console.error('[EntradaListener] Erro ao atualizar relatórios:', error);
    throw error;
  }
}

/**
 * Remove uma entrada do módulo Financeiro
 * Removes an income entry from the Financial module
 */
async function removerDoFinanceiro(entradaId: string) {
  try {
    await prisma.financeiro.deleteMany({
      where: {
        referenciaId: entradaId,
        tipo: 'receita'
      }
    });
  } catch (error) {
    console.error('[EntradaListener] Erro ao remover do financeiro:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre a exclusão de uma entrada
 * Notifies the Accounting module about an income deletion
 */
async function notificarContadorSobreExclusao(entradaId: string) {
  try {
    await prisma.contabilidade.deleteMany({
      where: {
        referenciaId: entradaId,
        tipo: 'receita'
      }
    });
  } catch (error) {
    console.error('[EntradaListener] Erro ao notificar contador sobre exclusão:', error);
    throw error;
  }
}

/**
 * Atualiza relatórios após a exclusão de uma entrada
 * Updates reports after an income deletion
 */
async function atualizarRelatoriosAposExclusao(entradaId: string) {
  try {
    // Aqui seria implementada a lógica para atualizar relatórios após exclusão
    // A implementação específica dependerá da estrutura do sistema de relatórios
    console.log('[EntradaListener] Relatórios atualizados após exclusão da entrada:', entradaId);
  } catch (error) {
    console.error('[EntradaListener] Erro ao atualizar relatórios após exclusão:', error);
    throw error;
  }
} 