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
  'entrada.parcelada.criada' |      // Novo evento para entradas parceladas
  'entrada.parcelada.atualizada' |  // Novo evento para atualização de parcelas
  'entrada.parcela.paga' |          // Novo evento para pagamento de parcela
  'saida.criada' |                  // Evento para criação de saída padrão
  'saida.atualizada' |              // Evento para atualização de saída
  'saida.excluida' |                // Evento para exclusão de saída
  'saida.parcelada.criada' |        // Novo evento para saídas parceladas
  'saida.parcelada.atualizada' |    // Novo evento para atualização de parcelas
  'saida.parcela.paga' |            // Novo evento para pagamento de parcela
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
  'estoque.item.adicionado' |      // Novo evento para adição de item ao estoque
  'estoque.item.atualizado' |      // Novo evento para atualização de item do estoque
  'estoque.item.removido' |        // Novo evento para remoção de item do estoque
  'estoque.item.proxim.vencimento' | // Novo evento para itens próximos do vencimento
  'estoque.item.vencido' |         // Novo evento para itens vencidos
  // Eventos de relatórios
  'relatorio.mensal.gerado' |
  // Eventos de notas fiscais
  'notaFiscal.gerada';

// Tipo para handlers de eventos
type EventHandler = (data: any) => void;

// Classe do EventBus
class EventBusService {
  // Armazena os handlers registrados para cada tipo de evento
  private handlers: { [key in EventName]?: EventHandler[] } = {};

  /**
   * Registra um handler para um tipo de evento
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
   */
  off(eventName: EventName, handler: EventHandler) {
    if (this.handlers[eventName]) {
      this.handlers[eventName] = this.handlers[eventName]?.filter(h => h !== handler);
    }
    return this;
  }

  /**
   * Emite um evento com dados para todos os handlers registrados
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
   */
  clear(eventName: EventName) {
    this.handlers[eventName] = [];
    return this;
  }

  /**
   * Remove todos os handlers de todos os eventos
   */
  clearAll() {
    this.handlers = {};
    return this;
  }

  /**
   * Remove todos os handlers de um tipo de evento (alias para clear)
   * @param eventName Nome do evento
   */
  removeAllListeners(eventName: EventName) {
    return this.clear(eventName);
  }
}

// Exporta uma instância única do EventBus (Singleton)
export const EventBus = new EventBusService(); 