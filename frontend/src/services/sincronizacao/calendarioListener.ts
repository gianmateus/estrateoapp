/**
 * Serviço para sincronização de eventos do calendário com outros módulos
 * 
 * Este serviço escuta eventos relacionados ao calendário e atualiza
 * a interface do usuário conforme necessário
 */

import { eventBus } from '../EventBus';
import { EventPayloadMap } from '../../types/EventTypes';
import { ENTRADA_EVENTS, AUSENCIA_EVENTS, FUNCIONARIO_EVENTS, FERIAS_EVENTS, FOLGA_EVENTS } from '../../constants/events';

// Interface para eventos do calendário
export interface EventoCalendario {
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio: Date;
  dataFim?: Date;
  tipo: 'pagamento' | 'entrada' | 'ferias' | 'ausencia' | 'folga' | 'fiscal' | 'outro';
  cor?: string;
  referenciaId?: string;
  modulo: 'financeiro' | 'funcionarios' | 'contador' | 'outro';
}

/**
 * Inicializa os listeners para eventos relacionados ao calendário
 */
export function initializeCalendarioListeners() {
  console.log('[CalendarioListener] Inicializando listeners de calendário');
  
  // Ouve eventos de entrada para atualizar o calendário
  eventBus.on(ENTRADA_EVENTS.CRIADA, async (entrada: EventPayloadMap[typeof ENTRADA_EVENTS.CRIADA]) => {
    console.log('[CalendarioListener] Processando evento entrada.criada para calendário', entrada.id);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-ent-${entrada.id}`,
        titulo: `Entrada: ${entrada.categoria}`,
        descricao: `Valor: ${entrada.valor}`,
        dataInicio: new Date(entrada.data),
        tipo: 'entrada',
        cor: '#4caf50', // Verde para entradas
        referenciaId: entrada.id,
        modulo: 'financeiro'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com entrada:', entrada.id);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao processar evento entrada.criada:', error);
    }
  });
  
  // Ouve eventos de férias para atualizar o calendário
  eventBus.on(FERIAS_EVENTS.REGISTRADAS, async (ferias: EventPayloadMap[typeof FERIAS_EVENTS.REGISTRADAS]) => {
    console.log('[CalendarioListener] Processando evento ferias.registradas para calendário', ferias.funcionarioId);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-fer-${ferias.funcionarioId}`,
        titulo: `Férias: ${ferias.funcionarioNome}`,
        descricao: ferias.metadata?.motivo,
        dataInicio: new Date(ferias.dataInicio),
        dataFim: new Date(ferias.dataFim),
        tipo: 'ferias',
        cor: '#2196f3', // Azul para férias
        referenciaId: ferias.funcionarioId,
        modulo: 'funcionarios'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com férias:', ferias.funcionarioId);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao atualizar calendário com férias:', error);
    }
  });
  
  // Ouve eventos de ausência para atualizar o calendário
  eventBus.on(AUSENCIA_EVENTS.REGISTRADA, async (ausencia: EventPayloadMap[typeof AUSENCIA_EVENTS.REGISTRADA]) => {
    console.log('[CalendarioListener] Processando evento ausencia.registrada para calendário', ausencia.funcionarioId);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-aus-${ausencia.funcionarioId}`,
        titulo: `Ausência: ${ausencia.funcionarioNome}`,
        descricao: ausencia.motivo,
        dataInicio: new Date(ausencia.dataInicio),
        dataFim: new Date(ausencia.dataFim),
        tipo: 'ausencia',
        cor: '#ff9800', // Laranja para ausências
        referenciaId: ausencia.funcionarioId,
        modulo: 'funcionarios'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com ausência:', ausencia.funcionarioId);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao processar evento ausencia.registrada:', error);
    }
  });
  
  // Ouve eventos de folga para atualizar o calendário
  eventBus.on(FOLGA_EVENTS.REGISTRADA, async (folga: EventPayloadMap[typeof FOLGA_EVENTS.REGISTRADA]) => {
    console.log('[CalendarioListener] Processando evento folga.registrada para calendário', folga.funcionarioId);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-flg-${folga.funcionarioId}`,
        titulo: `Folga: ${folga.funcionarioNome}`,
        descricao: undefined, // O evento de folga não tem motivo no payload
        dataInicio: new Date(folga.data),
        tipo: 'folga',
        cor: '#9c27b0', // Roxo para folgas
        referenciaId: folga.funcionarioId,
        modulo: 'funcionarios'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com folga:', folga.funcionarioId);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao atualizar calendário com folga:', error);
    }
  });
  
  // Ouve eventos de pagamento de salário para atualizar o calendário
  eventBus.on(FUNCIONARIO_EVENTS.SALARIO_PAGO, async (salario: EventPayloadMap[typeof FUNCIONARIO_EVENTS.SALARIO_PAGO]) => {
    console.log('[CalendarioListener] Processando evento salario.pago para calendário', salario.funcionarioId);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-sal-${salario.funcionarioId}`,
        titulo: `Salário: ${salario.funcionarioNome}`,
        descricao: `Valor: ${salario.valor}`,
        dataInicio: new Date(salario.data),
        tipo: 'pagamento',
        cor: '#795548', // Marrom para salários
        referenciaId: salario.funcionarioId,
        modulo: 'funcionarios'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com salário:', salario.funcionarioId);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao processar evento salario.pago:', error);
    }
  });
}

/**
 * Funções auxiliares para gerenciar os eventos do calendário
 */

// Função para adicionar um evento ao calendário na UI
async function adicionarEventoCalendario(evento: EventoCalendario) {
  // Esta função seria implementada para atualizar o estado 
  // do calendário na UI ou fazer uma chamada à API
  console.log('[CalendarioListener] Adicionando evento ao calendário:', evento);
  
  // Exemplo de uso com uma API hipotética ou estado local
  // await api.post('/api/calendario/eventos', evento);
  // ou
  // dispatch({ type: 'ADD_CALENDAR_EVENT', payload: evento });
}

// Exporta a função de inicialização
export default initializeCalendarioListeners; 