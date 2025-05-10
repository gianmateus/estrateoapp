/**
 * Serviço para sincronização de pagamentos de funcionários com outros módulos
 * Service for synchronizing employee payments with other modules
 * 
 * Este serviço escuta eventos relacionados a pagamentos de funcionários e atualiza
 * os módulos afetados, como Contador, Financeiro e Calendário
 * 
 * This service listens to employee payment related events and updates
 * the affected modules, such as Accounting, Financial, and Calendar
 */

import prisma from '../../lib/prisma';
import { EventBus } from '../../lib/EventBus';

export interface PagamentoFuncionario {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  valor: number;
  data: Date;
  tipo: string;
  observacoes?: string;
  [key: string]: any;
}

/**
 * Inicializa os listeners para eventos relacionados a pagamentos de funcionários
 * Initializes listeners for employee payment-related events
 */
export function initializeFuncionarioListeners() {
  console.log('[FuncionarioListener] Inicializando listeners de pagamentos de funcionários');
  
  // Ouve evento de pagamento realizado
  // Listens for payment made event
  EventBus.on('funcionario.pagamento.realizado', async (pagamento: PagamentoFuncionario) => {
    console.log('[FuncionarioListener] Processando evento funcionario.pagamento.realizado', pagamento.id);
    
    try {
      // Atualiza o Calendário com o novo pagamento
      await atualizarCalendario(pagamento);
      
      // Atualiza o módulo Financeiro
      await atualizarFinanceiro(pagamento);
      
      // Notifica o módulo Contador
      await notificarContador(pagamento);
      
      console.log('[FuncionarioListener] Pagamento de funcionário sincronizado com sucesso', pagamento.id);
    } catch (error) {
      console.error('[FuncionarioListener] Erro ao sincronizar pagamento de funcionário:', error);
    }
  });
  
  // Ouve evento de pagamento cancelado
  // Listens for payment cancellation event
  EventBus.on('funcionario.pagamento.cancelado', async (pagamentoId: string) => {
    console.log('[FuncionarioListener] Processando evento funcionario.pagamento.cancelado', pagamentoId);
    
    try {
      // Remove do Calendário
      await removerDoCalendario(pagamentoId);
      
      // Remove do Financeiro
      await removerDoFinanceiro(pagamentoId);
      
      // Notifica o módulo Contador sobre o cancelamento
      await notificarContadorSobreCancelamento(pagamentoId);
      
      console.log('[FuncionarioListener] Cancelamento de pagamento sincronizado com sucesso', pagamentoId);
    } catch (error) {
      console.error('[FuncionarioListener] Erro ao sincronizar cancelamento de pagamento:', error);
    }
  });
}

/**
 * Atualiza o módulo Calendário com dados de pagamento de funcionário
 * Updates the Calendar module with employee payment data
 */
async function atualizarCalendario(pagamento: PagamentoFuncionario) {
  try {
    // Cria uma nova entrada no calendário
    await prisma.calendario.create({
      data: {
        titulo: `Pagamento: ${pagamento.funcionarioNome}`,
        data: pagamento.data,
        tipo: 'despesa',
        categoria: 'folha_pagamento',
        valor: pagamento.valor,
        referenciaId: pagamento.id
      }
    });
  } catch (error) {
    console.error('[FuncionarioListener] Erro ao atualizar calendário:', error);
    throw error;
  }
}

/**
 * Atualiza o módulo Financeiro com dados de pagamento de funcionário
 * Updates the Financial module with employee payment data
 */
async function atualizarFinanceiro(pagamento: PagamentoFuncionario) {
  try {
    // Cria um novo registro financeiro
    await prisma.financeiro.create({
      data: {
        descricao: `Pagamento a funcionário: ${pagamento.funcionarioNome}`,
        data: pagamento.data,
        tipo: 'despesa',
        categoria: 'folha_pagamento',
        valor: pagamento.valor,
        referenciaId: pagamento.id
      }
    });
  } catch (error) {
    console.error('[FuncionarioListener] Erro ao atualizar financeiro:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre um pagamento de funcionário
 * Notifies the Accounting module about an employee payment
 */
async function notificarContador(pagamento: PagamentoFuncionario) {
  try {
    // Cria um novo registro contábil
    await prisma.contabilidade.create({
      data: {
        descricao: `Pagamento a funcionário: ${pagamento.funcionarioNome}`,
        data: pagamento.data,
        tipo: 'despesa',
        categoria: 'folha_pagamento',
        valor: pagamento.valor,
        referenciaId: pagamento.id
      }
    });
  } catch (error) {
    console.error('[FuncionarioListener] Erro ao notificar contador:', error);
    throw error;
  }
}

/**
 * Remove um pagamento de funcionário do Calendário
 * Removes an employee payment from the Calendar
 */
async function removerDoCalendario(pagamentoId: string) {
  try {
    await prisma.calendario.deleteMany({
      where: {
        referenciaId: pagamentoId,
        tipo: 'despesa',
        categoria: 'folha_pagamento'
      }
    });
  } catch (error) {
    console.error('[FuncionarioListener] Erro ao remover do calendário:', error);
    throw error;
  }
}

/**
 * Remove um pagamento de funcionário do módulo Financeiro
 * Removes an employee payment from the Financial module
 */
async function removerDoFinanceiro(pagamentoId: string) {
  try {
    await prisma.financeiro.deleteMany({
      where: {
        referenciaId: pagamentoId,
        tipo: 'despesa',
        categoria: 'folha_pagamento'
      }
    });
  } catch (error) {
    console.error('[FuncionarioListener] Erro ao remover do financeiro:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre o cancelamento de um pagamento de funcionário
 * Notifies the Accounting module about an employee payment cancellation
 */
async function notificarContadorSobreCancelamento(pagamentoId: string) {
  try {
    await prisma.contabilidade.deleteMany({
      where: {
        referenciaId: pagamentoId,
        tipo: 'despesa',
        categoria: 'folha_pagamento'
      }
    });
  } catch (error) {
    console.error('[FuncionarioListener] Erro ao notificar contador sobre cancelamento:', error);
    throw error;
  }
} 