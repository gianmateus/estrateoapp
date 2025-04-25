/**
 * EventBus - Sistema de Eventos para comunicação entre módulos
 *
 * Este serviço permite que diferentes módulos da aplicação se comuniquem
 * entre si sem acoplamento direto, usando um sistema de publicação e inscrição.
 *
 * Event Bus - System for communication between modules
 * This service allows different application modules to communicate
 * with each other without direct coupling, using a publish-subscribe system.
 */

// Tipos de eventos suportados pelo sistema
// Supported event types in the system
export type EventName = 
  'pagamento.criado' | 
  'pagamento.atualizado' | 
  'pagamento.excluido' |
  'entrada.criada' | 
  'entrada.atualizada' | 
  'entrada.excluida' |
  'funcionario.pagamento.realizado' | 
  'funcionario.pagamento.cancelado' |
  'estoque.movimentado' |
  'estoque.item.abaixo.minimo';

// Sistema de eventos
// Event system
export class EventBus {
  private static listeners = new Map<EventName, Function[]>();

  /**
   * Registra um ouvinte para um evento específico
   * Registers a listener for a specific event
   */
  static on(event: EventName, callback: Function) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(callback);
    
    console.log(`[EventBus] Listener registrado para o evento: ${event}`);
  }

  /**
   * Emite um evento com uma carga útil para todos os ouvintes registrados
   * Emits an event with a payload to all registered listeners
   */
  static emit(event: EventName, payload: any) {
    const callbacks = this.listeners.get(event) || [];
    
    console.log(`[EventBus] Emitindo evento: ${event} com ${callbacks.length} ouvintes`);
    
    callbacks.forEach(cb => {
      try {
        cb(payload);
      } catch (error) {
        console.error(`[EventBus] Erro ao processar evento ${event}:`, error);
      }
    });
  }

  /**
   * Remove um ouvinte específico para um evento
   * Removes a specific listener for an event
   */
  static off(event: EventName, callback: Function) {
    if (!this.listeners.has(event)) return;
    
    const listeners = this.listeners.get(event)!;
    const index = listeners.indexOf(callback);
    
    if (index !== -1) {
      listeners.splice(index, 1);
      console.log(`[EventBus] Listener removido do evento: ${event}`);
    }
  }

  /**
   * Remove todos os ouvintes de um evento específico
   * Removes all listeners for a specific event
   */
  static removeAllListeners(event?: EventName) {
    if (event) {
      this.listeners.delete(event);
      console.log(`[EventBus] Todos os listeners removidos do evento: ${event}`);
    } else {
      this.listeners.clear();
      console.log(`[EventBus] Todos os listeners removidos de todos os eventos`);
    }
  }
} 