/**
 * EventBus - Sistema de Eventos para comunicação entre módulos no Frontend
 *
 * Este serviço permite que diferentes módulos da aplicação se comuniquem
 * entre si sem acoplamento direto, usando um sistema de publicação e inscrição.
 */

import { EventName, EventPayloadMap } from '../types/EventTypes';

type EventCallback<T extends EventName> = (payload: EventPayloadMap[T]) => void;

/**
 * Interface para o logger do EventBus
 */
interface EventBusLogger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

/**
 * Implementação padrão do logger usando console
 */
class ConsoleLogger implements EventBusLogger {
  info(message: string, ...args: unknown[]): void {
    console.log(`[EventBus] ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[EventBus] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[EventBus] ${message}`, ...args);
  }
}

/**
 * Classe EventBus - Gerenciador de eventos do sistema
 * Implementa o padrão Singleton e fornece uma interface tipada para eventos
 */
export class EventBus {
  private static instance: EventBus;
  private listeners: Map<EventName, Set<EventCallback<any>>>;
  private logger: Console;

  private constructor() {
    this.listeners = new Map();
    this.logger = console;
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
   * Registra um listener para um evento específico
   * @param eventName Nome do evento
   * @param callback Função a ser executada quando o evento for emitido
   * @returns Função para remover o listener
   */
  public on<T extends EventName>(
    eventName: T,
    callback: EventCallback<T>
  ): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    const typedCallback = callback as EventCallback<EventName>;
    this.listeners.get(eventName)?.add(typedCallback);
    
    return () => this.off(eventName, typedCallback);
  }

  /**
   * Remove um listener de um evento específico
   * @param eventName Nome do evento
   * @param callback Função a ser removida
   */
  public off<T extends EventName>(
    eventName: T,
    callback: EventCallback<T>
  ): void {
    const typedCallback = callback as EventCallback<EventName>;
    this.listeners.get(eventName)?.delete(typedCallback);
  }

  /**
   * Emite um evento com payload tipado
   * @param eventName Nome do evento
   * @param payload Dados do evento
   */
  public emit<T extends EventName>(
    eventName: T,
    payload: Omit<EventPayloadMap[T], 'timestamp' | 'source'>
  ): void {
    const fullPayload = {
      ...payload,
      timestamp: new Date().toISOString(),
      source: 'EventBus'
    } as unknown as EventPayloadMap[T];

    this.logger.info(`Emitindo evento: ${eventName}`, fullPayload);
    
    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(fullPayload);
        } catch (error) {
          this.logger.error(
            `Erro ao processar evento ${eventName}:`,
            error
          );
        }
      });
    }
  }

  /**
   * Remove todos os listeners de um evento específico
   * @param eventName Nome do evento
   */
  public clear(eventName: EventName): void {
    this.logger.info(`Removendo todos os listeners do evento: ${eventName}`);
    this.listeners.delete(eventName);
  }

  /**
   * Remove todos os listeners de todos os eventos
   */
  public clearAll(): void {
    this.logger.info('Removendo todos os listeners');
    this.listeners.clear();
  }

  /**
   * Obtém o número de listeners para um evento específico
   * @param eventName Nome do evento
   */
  public getListenerCount(eventName: EventName): number {
    return this.listeners.get(eventName)?.size || 0;
  }

  /**
   * Verifica se um evento tem listeners
   * @param eventName Nome do evento
   */
  public hasListeners(eventName: EventName): boolean {
    return this.getListenerCount(eventName) > 0;
  }
}

// Exporta uma instância única do EventBus
export const eventBus = EventBus.getInstance(); 