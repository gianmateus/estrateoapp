/**
 * Módulo de Sincronização de Eventos
 * 
 * Este módulo centraliza a inicialização de todos os listeners de eventos
 * do sistema, garantindo que as atualizações sejam propagadas entre módulos.
 */

import { initializeFuncionariosListeners } from './funcionariosListener';
import { initializeCalendarioListeners } from './calendarioListener';
import taxesListener from '../events/taxesListener';

/**
 * Inicializa todos os listeners de eventos do sistema no frontend
 */
export function initializeAllListeners() {
  console.log('[EventSynchronization] Inicializando todos os listeners de eventos no frontend');
  
  // Inicializa os listeners de funcionários
  initializeFuncionariosListeners();
  
  // Inicializa os listeners do calendário
  initializeCalendarioListeners();
  
  // Inicializar listener de impostos
  taxesListener.initialize();
  
  console.log('[EventSynchronization] Todos os listeners inicializados com sucesso no frontend');
}

export function cleanupAllListeners() {
  // Limpar listener de impostos
  taxesListener.cleanup();
}

// Exporta todas as funções inicializadoras
export {
  initializeFuncionariosListeners,
  initializeCalendarioListeners
}; 