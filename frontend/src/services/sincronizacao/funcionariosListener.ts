/**
 * Serviço para sincronização de eventos de funcionários com outros módulos
 * 
 * Este serviço escuta eventos relacionados a funcionários (férias, folgas, ausências, etc.)
 * e atualiza os módulos afetados, como Calendário, Financeiro e Relatórios
 */

import { EventBus } from '../EventBus';

// Interfaces para os tipos de dados
export interface Ferias {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: Date;
  dataFim: Date;
  observacoes?: string;
}

export interface Ausencia {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: Date;
  dataFim: Date;
  motivo: string;
}

export interface Folga {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  dataFolga: Date;
  motivo: string;
}

export interface Salario {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  valorLiquido: number;
  dataPagamento: Date;
}

/**
 * Inicializa os listeners para eventos relacionados a funcionários
 */
export function initializeFuncionariosListeners() {
  console.log('[FuncionariosListener] Inicializando listeners de funcionários');
  
  // Ouve evento de registro de férias
  EventBus.on('ferias.registradas', async (ferias: Ferias) => {
    console.log('[FuncionariosListener] Processando evento ferias.registradas', ferias.id);
    
    try {
      // Atualiza o Calendário com as novas férias
      await atualizarCalendario(ferias);
      
      // Atualiza o módulo Financeiro, se necessário
      await atualizarFinanceiro(ferias);
      
      // Atualiza Relatórios de RH
      await atualizarRelatoriosRH(ferias);
      
      console.log('[FuncionariosListener] Férias sincronizadas com sucesso', ferias.id);
    } catch (error) {
      console.error('[FuncionariosListener] Erro ao sincronizar férias:', error);
    }
  });
  
  // Ouve evento de registro de ausência
  EventBus.on('ausencia.registrada', async (ausencia: Ausencia) => {
    console.log('[FuncionariosListener] Processando evento ausencia.registrada', ausencia.id);
    
    try {
      // Atualiza o Calendário com a nova ausência
      await atualizarCalendarioAusencia(ausencia);
      
      // Atualiza Relatórios de RH
      await atualizarRelatoriosRHAusencia(ausencia);
      
      console.log('[FuncionariosListener] Ausência sincronizada com sucesso', ausencia.id);
    } catch (error) {
      console.error('[FuncionariosListener] Erro ao sincronizar ausência:', error);
    }
  });
  
  // Ouve evento de registro de folga
  EventBus.on('folga.registrada', async (folga: Folga) => {
    console.log('[FuncionariosListener] Processando evento folga.registrada', folga.id);
    
    try {
      // Atualiza o Calendário com a nova folga
      await atualizarCalendarioFolga(folga);
      
      // Atualiza Relatórios de RH
      await atualizarRelatoriosRHFolga(folga);
      
      console.log('[FuncionariosListener] Folga sincronizada com sucesso', folga.id);
    } catch (error) {
      console.error('[FuncionariosListener] Erro ao sincronizar folga:', error);
    }
  });
  
  // Ouve evento de pagamento de salário
  EventBus.on('salario.pago', async (salario: Salario) => {
    console.log('[FuncionariosListener] Processando evento salario.pago', salario.id);
    
    try {
      // Atualiza o Calendário com o pagamento
      await atualizarCalendarioSalario(salario);
      
      // Atualiza o módulo Financeiro
      await atualizarFinanceiroSalario(salario);
      
      // Atualiza Relatórios de RH
      await atualizarRelatoriosRHSalario(salario);
      
      console.log('[FuncionariosListener] Salário sincronizado com sucesso', salario.id);
    } catch (error) {
      console.error('[FuncionariosListener] Erro ao sincronizar salário:', error);
    }
  });
}

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