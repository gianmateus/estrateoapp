/**
 * Serviço para sincronização de pagamentos com outros módulos
 * Service for synchronizing payments with other modules
 * 
 * Este serviço escuta eventos relacionados a pagamentos e atualiza
 * os módulos afetados, como Calendário, Contador e Financeiro
 * 
 * This service listens to payment-related events and updates
 * the affected modules, such as Calendar, Accounting, and Financial
 */

import prisma from '../../lib/prisma';
import { EventBus } from '../../lib/EventBus';

export interface Pagamento {
  id: string;
  descricao: string;
  valor: number;
  data: Date;
  status: string;
  tipo: string;
  referencia?: string;
  [key: string]: any;
}

/**
 * Inicializa os listeners para eventos relacionados a pagamentos
 * Initializes listeners for payment-related events
 */
export function initializePagamentoListeners() {
  console.log('[PagamentoListener] Inicializando listeners de pagamentos');
  
  // Ouve evento de criação de pagamento
  // Listens for payment creation event
  EventBus.on('pagamento.criado', async (pagamento: Pagamento) => {
    console.log('[PagamentoListener] Processando evento pagamento.criado', pagamento.id);
    
    try {
      // Atualiza o Calendário com o novo pagamento
      await atualizarCalendario(pagamento);
      
      // Atualiza o módulo Financeiro
      await atualizarFinanceiro(pagamento);
      
      // Notifica o módulo Contador
      await notificarContador(pagamento);
      
      console.log('[PagamentoListener] Pagamento sincronizado com sucesso', pagamento.id);
    } catch (error) {
      console.error('[PagamentoListener] Erro ao sincronizar pagamento:', error);
    }
  });
  
  // Ouve evento de atualização de pagamento
  // Listens for payment update event
  EventBus.on('pagamento.atualizado', async (pagamento: Pagamento) => {
    console.log('[PagamentoListener] Processando evento pagamento.atualizado', pagamento.id);
    
    try {
      // Atualiza o Calendário
      await atualizarCalendario(pagamento, true);
      
      // Atualiza o módulo Financeiro
      await atualizarFinanceiro(pagamento, true);
      
      // Notifica o módulo Contador
      await notificarContador(pagamento, true);
      
      console.log('[PagamentoListener] Atualização de pagamento sincronizada com sucesso', pagamento.id);
    } catch (error) {
      console.error('[PagamentoListener] Erro ao sincronizar atualização de pagamento:', error);
    }
  });
  
  // Ouve evento de exclusão de pagamento
  // Listens for payment deletion event
  EventBus.on('pagamento.excluido', async (pagamentoId: string) => {
    console.log('[PagamentoListener] Processando evento pagamento.excluido', pagamentoId);
    
    try {
      // Remove do Calendário
      await removerDoCalendario(pagamentoId);
      
      // Remove do Financeiro
      await removerDoFinanceiro(pagamentoId);
      
      // Notifica o módulo Contador sobre a exclusão
      await notificarContadorSobreExclusao(pagamentoId);
      
      console.log('[PagamentoListener] Exclusão de pagamento sincronizada com sucesso', pagamentoId);
    } catch (error) {
      console.error('[PagamentoListener] Erro ao sincronizar exclusão de pagamento:', error);
    }
  });
}

/**
 * Atualiza o módulo Calendário com dados de pagamento
 * Updates the Calendar module with payment data
 */
async function atualizarCalendario(pagamento: Pagamento, isUpdate = false) {
  try {
    // Verifica se já existe uma entrada no calendário para este pagamento
    const eventoExistente = await prisma.calendario.findFirst({
      where: {
        referenciaId: pagamento.id,
        tipo: 'despesa'
      }
    });
    
    if (isUpdate && eventoExistente) {
      // Atualiza a entrada existente
      await prisma.calendario.update({
        where: { id: eventoExistente.id },
        data: {
          titulo: `Pagamento: ${pagamento.descricao}`,
          data: pagamento.data,
          valor: pagamento.valor,
          status: pagamento.status
        }
      });
    } else if (!eventoExistente) {
      // Cria uma nova entrada no calendário
      await prisma.calendario.create({
        data: {
          titulo: `Pagamento: ${pagamento.descricao}`,
          data: pagamento.data,
          tipo: 'despesa',
          valor: pagamento.valor,
          status: pagamento.status,
          referenciaId: pagamento.id
        }
      });
    }
  } catch (error) {
    console.error('[PagamentoListener] Erro ao atualizar calendário:', error);
    throw error;
  }
}

/**
 * Atualiza o módulo Financeiro com dados de pagamento
 * Updates the Financial module with payment data
 */
async function atualizarFinanceiro(pagamento: Pagamento, isUpdate = false) {
  try {
    // Verifica se já existe um registro financeiro para este pagamento
    const registroExistente = await prisma.financeiro.findFirst({
      where: {
        referenciaId: pagamento.id,
        tipo: 'despesa'
      }
    });
    
    if (isUpdate && registroExistente) {
      // Atualiza o registro existente
      await prisma.financeiro.update({
        where: { id: registroExistente.id },
        data: {
          descricao: pagamento.descricao,
          data: pagamento.data,
          valor: pagamento.valor,
          status: pagamento.status
        }
      });
    } else if (!registroExistente) {
      // Cria um novo registro financeiro
      await prisma.financeiro.create({
        data: {
          descricao: pagamento.descricao,
          data: pagamento.data,
          tipo: 'despesa',
          valor: pagamento.valor,
          status: pagamento.status,
          referenciaId: pagamento.id
        }
      });
    }
  } catch (error) {
    console.error('[PagamentoListener] Erro ao atualizar financeiro:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre um novo pagamento ou atualização
 * Notifies the Accounting module about a new payment or update
 */
async function notificarContador(pagamento: Pagamento, isUpdate = false) {
  try {
    // Verifica se já existe um registro contábil para este pagamento
    const registroExistente = await prisma.contabilidade.findFirst({
      where: {
        referenciaId: pagamento.id,
        tipo: 'despesa'
      }
    });
    
    if (isUpdate && registroExistente) {
      // Atualiza o registro existente
      await prisma.contabilidade.update({
        where: { id: registroExistente.id },
        data: {
          descricao: pagamento.descricao,
          data: pagamento.data,
          valor: pagamento.valor,
          status: pagamento.status
        }
      });
    } else if (!registroExistente) {
      // Cria um novo registro contábil
      await prisma.contabilidade.create({
        data: {
          descricao: pagamento.descricao,
          data: pagamento.data,
          tipo: 'despesa',
          categoria: 'pagamento',
          valor: pagamento.valor,
          status: pagamento.status,
          referenciaId: pagamento.id
        }
      });
    }
  } catch (error) {
    console.error('[PagamentoListener] Erro ao notificar contador:', error);
    throw error;
  }
}

/**
 * Remove um pagamento do Calendário
 * Removes a payment from the Calendar
 */
async function removerDoCalendario(pagamentoId: string) {
  try {
    await prisma.calendario.deleteMany({
      where: {
        referenciaId: pagamentoId,
        tipo: 'despesa'
      }
    });
  } catch (error) {
    console.error('[PagamentoListener] Erro ao remover do calendário:', error);
    throw error;
  }
}

/**
 * Remove um pagamento do módulo Financeiro
 * Removes a payment from the Financial module
 */
async function removerDoFinanceiro(pagamentoId: string) {
  try {
    await prisma.financeiro.deleteMany({
      where: {
        referenciaId: pagamentoId,
        tipo: 'despesa'
      }
    });
  } catch (error) {
    console.error('[PagamentoListener] Erro ao remover do financeiro:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre a exclusão de um pagamento
 * Notifies the Accounting module about a payment deletion
 */
async function notificarContadorSobreExclusao(pagamentoId: string) {
  try {
    await prisma.contabilidade.deleteMany({
      where: {
        referenciaId: pagamentoId,
        tipo: 'despesa'
      }
    });
  } catch (error) {
    console.error('[PagamentoListener] Erro ao notificar contador sobre exclusão:', error);
    throw error;
  }
} 