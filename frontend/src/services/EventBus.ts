/**
 * EventBus - Sistema de Eventos para comunicação entre módulos no Frontend
 *
 * Este serviço permite que diferentes módulos da aplicação se comuniquem
 * entre si sem acoplamento direto, usando um sistema de publicação e inscrição.
 */

// Tipos de eventos suportados pelo sistema
export type EventName = 
  // Eventos de financeiro
  'pagamento.criado' | 
  'pagamento.atualizado' | 
  'pagamento.excluido' |
  'entrada.criada' | 
  'entrada.atualizada' | 
  'entrada.excluida' |
  // Eventos de funcionários
  'funcionario.pagamento.realizado' | 
  'funcionario.pagamento.cancelado' |
  'ferias.registradas' |
  'folga.registrada' |
  'ausencia.registrada' |
  'salario.pago' |
  // Eventos de estoque
  'estoque.movimentado' |
  'estoque.item.abaixo.minimo' |
  // Eventos de relatórios
  'relatorio.mensal.gerado' |
  // Eventos de notas fiscais
  'notaFiscal.gerada';

// Sistema de eventos
export class EventBus {
  private static listeners = new Map<EventName, Function[]>();

  /**
   * Registra um ouvinte para um evento específico
   */
  static on(event: EventName, callback: Function) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(callback);
    
    console.log(`[EventBus] Listener registrado para o evento: ${event}`);
  }

  /**
   * Emite um evento com uma carga útil para todos os ouvintes registrados
   */
  static emit(event: EventName, payload: any) {
    const callbacks = this.listeners.get(event) || [];
    
    console.log(`[EventBus] Emitindo evento: ${event} com ${callbacks.length} ouvintes`, payload);
    
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