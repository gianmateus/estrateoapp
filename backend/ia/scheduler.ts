import { CronJob } from 'cron';
import { config } from '../config';
import { coletarDadosUsuarios, salvarRecomendacoes } from '../services/iaService';
import { gerarRecomendacoes } from './geradorChatGPT';
import { DadosUsuario } from '../types/IA';
import { logger } from '../utils/logger';

/**
 * Inicializa o agendador de tarefas para geração de recomendações diárias
 */
export function inicializarAgendador(): void {
  logger.info('Inicializando agendador de recomendações da IA...');
  
  // Tarefa para gerar recomendações diárias às 9h
  const tarefaDiaria = new CronJob(
    config.scheduler.recomendacoesDiarias,
    executarTarefaRecomendacoesDiarias,
    null,
    false,
    config.scheduler.timezone
  );
  
  // Iniciar o job
  tarefaDiaria.start();
  
  logger.info('Agendador inicializado com sucesso!');
  logger.info(`Próxima execução: ${tarefaDiaria.nextDate().toString()}`);
}

/**
 * Executa a tarefa de geração de recomendações diárias
 */
async function executarTarefaRecomendacoesDiarias(): Promise<void> {
  try {
    logger.info('Iniciando geração de recomendações diárias...');
    
    // 1. Coletar dados de todos os usuários
    const dadosUsuarios = await coletarDadosUsuarios();
    logger.info(`Dados coletados para ${dadosUsuarios.length} usuários`);
    
    // 2. Gerar e salvar recomendações para cada usuário
    for (const dadosUsuario of dadosUsuarios) {
      await processarRecomendacoesUsuario(dadosUsuario);
    }
    
    logger.info('Geração de recomendações diárias concluída com sucesso!');
  } catch (erro) {
    logger.error('Erro ao executar tarefa de recomendações diárias:', erro);
  }
}

/**
 * Processa as recomendações para um usuário específico
 */
async function processarRecomendacoesUsuario(dadosUsuario: DadosUsuario): Promise<void> {
  try {
    // Obter idioma preferido do usuário (implementação depende da estrutura do sistema)
    const idiomaUsuario = await obterIdiomaUsuario(dadosUsuario.userId);
    
    // Gerar recomendações com a API do ChatGPT
    const recomendacoes = await gerarRecomendacoes(dadosUsuario, idiomaUsuario);
    
    // Salvar as recomendações no banco de dados
    await salvarRecomendacoes(dadosUsuario.userId, recomendacoes);
    
    logger.info(`Geradas ${recomendacoes.length} recomendações para o usuário ${dadosUsuario.userId}`);
  } catch (erro) {
    logger.error(`Erro ao processar recomendações para o usuário ${dadosUsuario.userId}:`, erro);
  }
}

/**
 * Obtém o idioma preferido do usuário
 * Implementação depende da estrutura do sistema
 */
async function obterIdiomaUsuario(userId: string): Promise<string> {
  // TODO: Implementar lógica para obter o idioma preferido do usuário
  // Esta é uma implementação de exemplo que retorna inglês como padrão
  return 'en';
} 