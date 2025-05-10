/**
 * Módulo de Sincronização de Eventos
 * Event Synchronization Module
 * 
 * Esse módulo centraliza a inicialização de todos os listeners de eventos
 * do sistema, garantindo que as atualizações sejam propagadas entre módulos.
 * 
 * This module centralizes the initialization of all event listeners
 * in the system, ensuring that updates are propagated between modules.
 */

import { initializePagamentoListeners } from './pagamentoListener';
import { initializeEntradaListeners } from './entradaListener';
import { initializeFuncionarioListeners } from './funcionarioListener';
import { initializeEstoqueListeners } from './estoqueListener';

/**
 * Inicializa todos os listeners de eventos do sistema
 * Initializes all event listeners in the system
 */
export function initializeAllListeners() {
  console.log('[EventSynchronization] Inicializando todos os listeners de eventos');
  
  // Inicializa os listeners de pagamentos
  initializePagamentoListeners();
  
  // Inicializa os listeners de entradas
  initializeEntradaListeners();
  
  // Inicializa os listeners de pagamentos de funcionários
  initializeFuncionarioListeners();
  
  // Inicializa os listeners de estoque
  initializeEstoqueListeners();
  
  console.log('[EventSynchronization] Todos os listeners inicializados com sucesso');
}

// Exporta todas as funções inicializadoras
// Exports all initializer functions
export {
  initializePagamentoListeners,
  initializeEntradaListeners,
  initializeFuncionarioListeners,
  initializeEstoqueListeners
}; 