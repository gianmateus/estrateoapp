/**
 * Serviço para sincronização de eventos de funcionários com outros módulos
 * 
 * Este serviço escuta eventos relacionados a funcionários (férias, folgas, ausências, etc.)
 * e atualiza os módulos afetados, como Calendário, Financeiro e Relatórios
 */

import { eventBus } from '../EventBus';
import { EventPayloadMap } from '../../types/EventTypes';
import { FERIAS_EVENTS, AUSENCIA_EVENTS, FOLGA_EVENTS, FUNCIONARIO_EVENTS } from '../../constants/events';

interface Ferias {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: string;
  dataFim: string;
  motivo?: string;
}

interface Ausencia {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  tipo: 'doença' | 'pessoal' | 'outro';
  dataInicio: string;
  dataFim: string;
  motivo?: string;
}

interface Folga {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  dataFolga: string;
  tipo: 'folga' | 'feriado' | 'recesso';
  motivo?: string;
}

interface Salario {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  valorLiquido: number;
  dataPagamento: string;
  mes: string;
  ano: string;
}

export class FuncionariosListener {
  static initialize() {
    console.log('[FuncionariosListener] Inicializando listeners de funcionários');
    
    // Ouve evento de registro de férias
    eventBus.on(FERIAS_EVENTS.REGISTRADAS, async (payload: EventPayloadMap[typeof FERIAS_EVENTS.REGISTRADAS]) => {
      console.log('[FuncionariosListener] Processando evento ferias.registradas', payload.funcionarioId);
      
      try {
        const ferias: Ferias = {
          id: Math.random().toString(36).substr(2, 9),
          funcionarioId: payload.funcionarioId,
          funcionarioNome: payload.funcionarioNome,
          dataInicio: payload.dataInicio,
          dataFim: payload.dataFim,
          motivo: payload.metadata?.motivo
        };

        // Atualiza o Calendário com as novas férias
        await atualizarCalendario(ferias);
        
        // Atualiza o módulo Financeiro, se necessário
        await atualizarFinanceiro(ferias);
        
        // Atualiza Relatórios de RH
        await atualizarRelatoriosRH(ferias);
        
        console.log('[FuncionariosListener] Férias sincronizadas com sucesso', ferias.id);
      } catch (error) {
        console.error('[FuncionariosListener] Erro ao processar evento ferias.registradas:', error);
      }
    });

    // Ouve evento de registro de ausência
    eventBus.on(AUSENCIA_EVENTS.REGISTRADA, async (payload: EventPayloadMap[typeof AUSENCIA_EVENTS.REGISTRADA]) => {
      console.log('[FuncionariosListener] Processando evento ausencia.registrada', payload.funcionarioId);
      
      try {
        const ausencia: Ausencia = {
          id: Math.random().toString(36).substr(2, 9),
          funcionarioId: payload.funcionarioId,
          funcionarioNome: payload.funcionarioNome,
          tipo: payload.tipo,
          dataInicio: payload.dataInicio,
          dataFim: payload.dataFim,
          motivo: payload.motivo
        };

        // Atualiza o Calendário com a nova ausência
        await atualizarCalendarioAusencia(ausencia);
        
        // Atualiza Relatórios de RH
        await atualizarRelatoriosRHAusencia(ausencia);
        
        console.log('[FuncionariosListener] Ausência sincronizada com sucesso', ausencia.id);
      } catch (error) {
        console.error('[FuncionariosListener] Erro ao processar evento ausencia.registrada:', error);
      }
    });

    // Ouve evento de registro de folga
    eventBus.on(FOLGA_EVENTS.REGISTRADA, async (payload: EventPayloadMap[typeof FOLGA_EVENTS.REGISTRADA]) => {
      console.log('[FuncionariosListener] Processando evento folga.registrada', payload.funcionarioId);
      
      try {
        const folga: Folga = {
          id: Math.random().toString(36).substr(2, 9),
          funcionarioId: payload.funcionarioId,
          funcionarioNome: payload.funcionarioNome,
          dataFolga: payload.data,
          tipo: payload.tipo,
          motivo: undefined // O evento de folga não tem motivo no payload
        };

        // Atualiza o Calendário com a nova folga
        await atualizarCalendarioFolga(folga);
        
        // Atualiza Relatórios de RH
        await atualizarRelatoriosRHFolga(folga);
        
        console.log('[FuncionariosListener] Folga sincronizada com sucesso', folga.id);
      } catch (error) {
        console.error('[FuncionariosListener] Erro ao processar evento folga.registrada:', error);
      }
    });

    // Ouve evento de pagamento de salário
    eventBus.on(FUNCIONARIO_EVENTS.SALARIO_PAGO, async (payload: EventPayloadMap[typeof FUNCIONARIO_EVENTS.SALARIO_PAGO]) => {
      console.log('[FuncionariosListener] Processando evento salario.pago', payload.funcionarioId);
      
      try {
        const salario: Salario = {
          id: Math.random().toString(36).substr(2, 9),
          funcionarioId: payload.funcionarioId,
          funcionarioNome: payload.funcionarioNome,
          valorLiquido: payload.valor,
          dataPagamento: payload.data,
          mes: payload.mes,
          ano: payload.ano
        };

        // Atualiza o Calendário com o pagamento
        await atualizarCalendarioSalario(salario);
        
        // Atualiza o módulo Financeiro
        await atualizarFinanceiroSalario(salario);
        
        // Atualiza Relatórios de RH
        await atualizarRelatoriosRHSalario(salario);
        
        console.log('[FuncionariosListener] Salário sincronizado com sucesso', salario.id);
      } catch (error) {
        console.error('[FuncionariosListener] Erro ao processar evento salario.pago:', error);
      }
    });
  }
}

// Exporta a função de inicialização
export const initializeFuncionariosListeners = () => {
  FuncionariosListener.initialize();
};

/**
 * Funções auxiliares para atualizar outros módulos
 * Estas funções seriam implementadas para fazer as atualizações necessárias
 * em outros módulos baseadas nos eventos recebidos
 */

async function atualizarCalendario(ferias: Ferias) {
  // Implementação real faria requisições para a API
  console.log('[FuncionariosListener] Atualizando calendário com férias:', ferias.id);
  // Exemplo: adicionar evento ao calendário local/state
}

async function atualizarFinanceiro(ferias: Ferias) {
  console.log('[FuncionariosListener] Atualizando financeiro com férias:', ferias.id);
  // Implementação real faria requisições para a API
}

async function atualizarRelatoriosRH(ferias: Ferias) {
  console.log('[FuncionariosListener] Atualizando relatórios de RH com férias:', ferias.id);
  // Implementação real faria requisições para a API
}

async function atualizarCalendarioAusencia(ausencia: Ausencia) {
  console.log('[FuncionariosListener] Atualizando calendário com ausência:', ausencia.id);
  // Implementação real faria requisições para a API
}

async function atualizarRelatoriosRHAusencia(ausencia: Ausencia) {
  console.log('[FuncionariosListener] Atualizando relatórios de RH com ausência:', ausencia.id);
  // Implementação real faria requisições para a API
}

async function atualizarCalendarioFolga(folga: Folga) {
  console.log('[FuncionariosListener] Atualizando calendário com folga:', folga.id);
  // Implementação real faria requisições para a API
}

async function atualizarRelatoriosRHFolga(folga: Folga) {
  console.log('[FuncionariosListener] Atualizando relatórios de RH com folga:', folga.id);
  // Implementação real faria requisições para a API
}

async function atualizarCalendarioSalario(salario: Salario) {
  console.log('[FuncionariosListener] Atualizando calendário com salário:', salario.id);
  // Implementação real faria requisições para a API
}

async function atualizarFinanceiroSalario(salario: Salario) {
  console.log('[FuncionariosListener] Atualizando financeiro com salário:', salario.id);
  // Implementação real faria requisições para a API
}

async function atualizarRelatoriosRHSalario(salario: Salario) {
  console.log('[FuncionariosListener] Atualizando relatórios de RH com salário:', salario.id);
  // Implementação real faria requisições para a API
} 