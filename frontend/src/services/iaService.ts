import axios from 'axios';
import { api } from './api';

/**
 * Interface para mensagens da IA
 */
export interface IAMensagem {
  id: string;
  userId: string;
  mensagem: string;
  data: string;
  lida: boolean;
  acao?: string;
}

/**
 * Obtém as recomendações da IA para o dia atual
 * @param userId ID do usuário
 * @returns Array de mensagens da IA
 */
export async function obterRecomendacoesDoDia(userId: string): Promise<IAMensagem[]> {
  try {
    const { data } = await api.get(`/ia/recomendacoes/hoje/${userId}`);
    return data.recomendacoes;
  } catch (error) {
    console.error('Erro ao obter recomendações do dia:', error);
    throw error;
  }
}

/**
 * Obtém o histórico de recomendações da IA
 * @param userId ID do usuário
 * @param dataInicio Data de início opcional (YYYY-MM-DD)
 * @param dataFim Data de fim opcional (YYYY-MM-DD)
 * @returns Array de mensagens da IA
 */
export async function obterHistoricoRecomendacoes(
  userId: string,
  dataInicio?: string,
  dataFim?: string
): Promise<IAMensagem[]> {
  try {
    let url = `/ia/recomendacoes/historico/${userId}`;
    
    // Adicionar parâmetros de data se fornecidos
    if (dataInicio && dataFim) {
      url += `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }
    
    const { data } = await api.get(url);
    return data.recomendacoes;
  } catch (error) {
    console.error('Erro ao obter histórico de recomendações:', error);
    throw error;
  }
}

/**
 * Marca uma recomendação como lida
 * @param id ID da mensagem
 * @returns Verdadeiro se a operação foi bem-sucedida
 */
export async function marcarRecomendacaoComoLida(id: string): Promise<boolean> {
  try {
    const { data } = await api.put(`/ia/recomendacoes/lida/${id}`);
    return data.success;
  } catch (error) {
    console.error('Erro ao marcar recomendação como lida:', error);
    return false;
  }
} 