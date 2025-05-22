import { useEffect, useCallback, useRef, useState } from 'react';
import { EventName, EventPayloadMap, EventCallback } from '../types/EventTypes';

// Singleton do EventBus
class EventBus {
  private listeners: Map<EventName, Set<EventCallback<any>>> = new Map();
  private listenerCounts: Map<EventName, number> = new Map();

  /**
   * Registra um listener para um evento específico
   */
  on<T extends EventName>(event: T, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const eventListeners = this.listeners.get(event)!;
    eventListeners.add(callback);

    // Atualiza o contador de listeners
    this.listenerCounts.set(event, (this.listenerCounts.get(event) || 0) + 1);

    // Retorna uma função para remover o listener
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(event);
        }
        // Atualiza o contador de listeners
        this.listenerCounts.set(event, (this.listenerCounts.get(event) || 0) - 1);
      }
    };
  }

  /**
   * Emite um evento com um payload específico
   */
  emit<T extends EventName>(event: T, payload: EventPayloadMap[T]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Erro ao executar listener do evento ${event}:`, error);
        }
      });
    }
  }

  /**
   * Retorna o número de listeners ativos para um evento
   */
  getListenerCount(event: EventName): number {
    return this.listenerCounts.get(event) || 0;
  }
}

// Instância única do EventBus
const eventBus = new EventBus();

/**
 * Hook para registrar um listener de evento
 */
export function useEventBus<T extends EventName>(
  event: T,
  callback: EventCallback<T>,
  deps: any[] = []
): void {
  useEffect(() => {
    return eventBus.on(event, callback);
  }, [event, ...deps]);
}

/**
 * Hook para emitir eventos
 */
export function useEventEmitter() {
  return useCallback(<T extends EventName>(event: T, payload: EventPayloadMap[T]) => {
    eventBus.emit(event, payload);
  }, []);
}

/**
 * Hook para obter o número de listeners ativos para um evento
 */
export function useEventListenerCount(event: EventName): number {
  const countRef = useRef(eventBus.getListenerCount(event));

  useEffect(() => {
    const updateCount = () => {
      countRef.current = eventBus.getListenerCount(event);
    };

    // Atualiza o contador quando o componente montar
    updateCount();

    // Retorna uma função de limpeza
    return () => {
      // Não é necessário fazer nada aqui, pois o contador é atualizado automaticamente
      // quando os listeners são removidos
    };
  }, [event]);

  return countRef.current;
}

/**
 * Hook personalizado para verificar se um evento tem listeners
 * @param eventName Nome do evento a ser verificado
 * @returns Booleano indicando se o evento tem listeners
 */
export function useEventHasListeners(eventName: EventName): boolean {
  const [hasListeners, setHasListeners] = useState(false);

  useEffect(() => {
    // Verifica inicialmente
    setHasListeners(eventBus.getListenerCount(eventName) > 0);

    // Registra um listener para monitorar mudanças
    const unsubscribe = eventBus.on(eventName, () => {
      setHasListeners(eventBus.getListenerCount(eventName) > 0);
    });

    return () => {
      unsubscribe();
    };
  }, [eventName]);

  return hasListeners;
} 