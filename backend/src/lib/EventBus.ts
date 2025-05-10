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
  'entrada.parcelada.criada' |
  'entrada.parcela.paga' |
  'saida.parcelada.criada' |
  'saida.parcela.paga' |
  'funcionario.cadastrado' |
  'funcionario.atualizado' |
  'funcionario.status.alterado' |
  'funcionario.pagamento.realizado' | 
  'funcionario.pagamento.cancelado' |
  'estoque.movimentado' |
  'estoque.item.abaixo.minimo' |
  'estoque.item.adicionado' |
  'estoque.item.atualizado' |
  'estoque.item.removido' |
  'estoque.item.proxim.vencimento' |
  'estoque.item.vencido' |
  'imposto.declaracao.pendente' |
  'imposto.vencimento.proximo' |
  'imposto.novo.registrado' |
  'imposto.pago' |
  // Eventos para o módulo de Clientes
  'cliente.cadastrado' |
  'cliente.atualizado' |
  'cliente.removido' | 
  'cliente.interacao.adicionada' |
  'cliente.interacao.atualizada' |
  'cliente.interacao.removida' |
  'cliente.documento.adicionado' |
  'cliente.documento.atualizado' |
  'cliente.documento.removido' |
  'cliente.status.alterado';

// Tipo para handlers de eventos
// Type for event handlers
type EventHandler = (data: any) => void;

// Classe do EventBus
// EventBus class
class EventBusService {
  // Armazena os handlers registrados para cada tipo de evento
  // Stores registered handlers for each event type
  private handlers: { [key in EventName]?: EventHandler[] } = {};

  /**
   * Registra um handler para um tipo de evento
   * Registers a handler for an event type
   */
  on(eventName: EventName, handler: EventHandler) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName]?.push(handler);
    return this; // Para encadeamento (chaining)
  }

  /**
   * Remove um handler para um tipo de evento
   * Removes a handler for an event type
   */
  off(eventName: EventName, handler: EventHandler) {
    if (this.handlers[eventName]) {
      this.handlers[eventName] = this.handlers[eventName]?.filter(h => h !== handler);
    }
    return this;
  }

  /**
   * Emite um evento com dados para todos os handlers registrados
   * Emits an event with data to all registered handlers
   */
  emit(eventName: EventName, data: any) {
    if (this.handlers[eventName]) {
      console.log(`[EventBus] Emitindo evento: ${eventName}`);
      this.handlers[eventName]?.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[EventBus] Erro ao processar evento ${eventName}:`, error);
        }
      });
    } else {
      console.log(`[EventBus] Evento emitido sem handlers: ${eventName}`);
    }
    return this;
  }

  /**
   * Remove todos os handlers de um tipo de evento
   * Removes all handlers for an event type
   */
  clear(eventName: EventName) {
    this.handlers[eventName] = [];
    return this;
  }

  /**
   * Remove todos os handlers de todos os eventos
   * Removes all handlers for all events
   */
  clearAll() {
    this.handlers = {};
    return this;
  }
}

// Exporta uma instância única do EventBus (Singleton)
// Exports a single instance of EventBus (Singleton)
export const EventBus = new EventBusService(); 