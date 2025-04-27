/**
 * Serviço para sincronização de eventos do calendário com outros módulos
 * 
 * Este serviço escuta eventos relacionados ao calendário e atualiza
 * a interface do usuário conforme necessário
 */

import { EventBus } from '../EventBus';

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
  
  // Ouve eventos de pagamento para atualizar o calendário
  EventBus.on('pagamento.criado', async (pagamento: any) => {
    console.log('[CalendarioListener] Processando evento pagamento.criado para calendário', pagamento.id);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-pag-${pagamento.id}`,
        titulo: `Pagamento: ${pagamento.descricao}`,
        descricao: `Valor: ${pagamento.valor} - ${pagamento.status}`,
        dataInicio: pagamento.data,
        tipo: 'pagamento',
        cor: '#ff5252', // Vermelho para pagamentos
        referenciaId: pagamento.id,
        modulo: 'financeiro'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com pagamento:', pagamento.id);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao atualizar calendário com pagamento:', error);
    }
  });
  
  // Ouve eventos de entrada para atualizar o calendário
  EventBus.on('entrada.criada', async (entrada: any) => {
    console.log('[CalendarioListener] Processando evento entrada.criada para calendário', entrada.id);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-ent-${entrada.id}`,
        titulo: `Entrada: ${entrada.descricao}`,
        descricao: `Valor: ${entrada.valor} - ${entrada.fonte}`,
        dataInicio: entrada.data,
        tipo: 'entrada',
        cor: '#4caf50', // Verde para entradas
        referenciaId: entrada.id,
        modulo: 'financeiro'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com entrada:', entrada.id);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao atualizar calendário com entrada:', error);
    }
  });
  
  // Ouve eventos de férias para atualizar o calendário
  EventBus.on('ferias.registradas', async (ferias: any) => {
    console.log('[CalendarioListener] Processando evento ferias.registradas para calendário', ferias.id);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-fer-${ferias.id}`,
        titulo: `Férias: ${ferias.funcionarioNome}`,
        descricao: ferias.observacoes,
        dataInicio: ferias.dataInicio,
        dataFim: ferias.dataFim,
        tipo: 'ferias',
        cor: '#2196f3', // Azul para férias
        referenciaId: ferias.id,
        modulo: 'funcionarios'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com férias:', ferias.id);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao atualizar calendário com férias:', error);
    }
  });
  
  // Ouve eventos de ausência para atualizar o calendário
  EventBus.on('ausencia.registrada', async (ausencia: any) => {
    console.log('[CalendarioListener] Processando evento ausencia.registrada para calendário', ausencia.id);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-aus-${ausencia.id}`,
        titulo: `Ausência: ${ausencia.funcionarioNome}`,
        descricao: ausencia.motivo,
        dataInicio: ausencia.dataInicio,
        dataFim: ausencia.dataFim,
        tipo: 'ausencia',
        cor: '#ff9800', // Laranja para ausências
        referenciaId: ausencia.id,
        modulo: 'funcionarios'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com ausência:', ausencia.id);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao atualizar calendário com ausência:', error);
    }
  });
  
  // Ouve eventos de folga para atualizar o calendário
  EventBus.on('folga.registrada', async (folga: any) => {
    console.log('[CalendarioListener] Processando evento folga.registrada para calendário', folga.id);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-flg-${folga.id}`,
        titulo: `Folga: ${folga.funcionarioNome}`,
        descricao: folga.motivo,
        dataInicio: folga.dataFolga,
        tipo: 'folga',
        cor: '#9c27b0', // Roxo para folgas
        referenciaId: folga.id,
        modulo: 'funcionarios'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com folga:', folga.id);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao atualizar calendário com folga:', error);
    }
  });
  
  // Ouve eventos de pagamento de salário para atualizar o calendário
  EventBus.on('salario.pago', async (salario: any) => {
    console.log('[CalendarioListener] Processando evento salario.pago para calendário', salario.id);
    
    try {
      const eventoCalendario: EventoCalendario = {
        id: `cal-sal-${salario.id}`,
        titulo: `Salário: ${salario.funcionarioNome}`,
        descricao: `Valor: ${salario.valorLiquido}`,
        dataInicio: salario.dataPagamento,
        tipo: 'pagamento',
        cor: '#795548', // Marrom para salários
        referenciaId: salario.id,
        modulo: 'funcionarios'
      };
      
      // Atualizar calendário na UI
      await adicionarEventoCalendario(eventoCalendario);
      
      console.log('[CalendarioListener] Calendário atualizado com salário:', salario.id);
    } catch (error) {
      console.error('[CalendarioListener] Erro ao atualizar calendário com salário:', error);
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