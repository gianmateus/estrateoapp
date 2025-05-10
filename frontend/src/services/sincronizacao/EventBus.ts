import { EventPayload } from '../../types/EventTypes';

/**
 * Serviço de gerenciamento de eventos do sistema
 * @module EventBus
 */
type EventCallback = (payload: EventPayload) => void;

class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Set<EventCallback>>;

  private constructor() {
    this.listeners = new Map();
  }

  /**
   * Obtém a instância única do EventBus
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Emite um evento com payload tipado
   * @param eventName Nome do evento
   * @param payload Dados do evento
   */
  public emit(type: string, payload: EventPayload): void {
    console.log(`[EventBus] Evento emitido: '${type}'`, payload);
    
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach(callback => {
        // Type narrowing baseado no tipo do evento
        switch (type) {
          case 'ferias.registradas':
            callback(payload as EventPayload);
            break;
          case 'ferias.canceladas':
            callback(payload as EventPayload);
            break;
          case 'ferias.alteradas':
            callback(payload as EventPayload);
            break;
          default:
            callback(payload);
        }
      });
    }
  }

  /**
   * Registra um listener para um evento específico
   * @param eventName Nome do evento
   * @param callback Função a ser executada quando o evento for emitido
   */
  public on(type: string, callback: EventCallback): void {
    console.log(`[EventBus] Listener registrado para evento: '${type}'`);
    
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(callback);
  }

  /**
   * Remove um listener de um evento específico
   * @param eventName Nome do evento
   * @param callback Função a ser removida
   */
  public off(type: string, callback: EventCallback): void {
    console.log(`[EventBus] Listener removido do evento: '${type}'`);
    
    this.listeners.get(type)?.delete(callback);
  }

  /**
   * Remove todos os listeners de um evento específico
   * @param eventName Nome do evento
   */
  public removeAllListeners(type: string): void {
    console.log(`[EventBus] Todos os listeners removidos do evento: '${type}'`);
    this.listeners.delete(type);
  }
}

export default EventBus; 