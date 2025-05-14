import { DadosUsuario, IAMensagem } from '../types/IA';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../database/connection';

/**
 * Coleta dados relevantes de todos os usuários ativos para gerar recomendações
 */
export async function coletarDadosUsuarios(): Promise<DadosUsuario[]> {
  try {
    // Em um sistema real, isso buscaria dados do banco de dados
    // Aqui estamos simulando o retorno para fins de desenvolvimento
    
    // Selecionar usuários ativos
    const resultUsuarios = await pool.query(`
      SELECT id, username, email, language
      FROM usuarios
      WHERE status = 'active'
    `);
    
    const usuarios = resultUsuarios.rows;
    const dadosUsuarios: DadosUsuario[] = [];
    
    // Para cada usuário, coletar dados financeiros, estoque, etc.
    for (const usuario of usuarios) {
      const userId = usuario.id;
      
      // 1. Dados financeiros
      const dadosFinanceiros = await obterDadosFinanceiros(userId);
      
      // 2. Itens de estoque críticos
      const itensEstoqueCritico = await obterItensEstoqueCritico(userId);
      
      // 3. Contas a vencer
      const contasAVencer = await obterContasAVencer(userId);
      
      // 4. Status do relatório mensal
      const relatorioMensalGerado = await verificarRelatorioMensalGerado(userId);
      
      // Montar objeto com todos os dados do usuário
      dadosUsuarios.push({
        userId,
        saldoAtual: dadosFinanceiros.saldoAtual,
        entradasSemana: dadosFinanceiros.entradasSemana,
        saidasSemana: dadosFinanceiros.saidasSemana,
        itensEstoqueCritico,
        contasAVencer,
        relatorioMensalGerado
      });
    }
    
    return dadosUsuarios;
  } catch (erro) {
    logger.error('Erro ao coletar dados dos usuários:', erro);
    return []; // Em caso de erro, retorna lista vazia
  }
}

/**
 * Salva as recomendações geradas para um usuário
 */
export async function salvarRecomendacoes(userId: string, recomendacoes: string[]): Promise<void> {
  try {
    const dataAtual = new Date();
    
    // Inserir cada recomendação no banco de dados
    for (const mensagem of recomendacoes) {
      await pool.query(
        `INSERT INTO ia_mensagens (id, user_id, mensagem, data, lida)
         VALUES ($1, $2, $3, $4, $5)`,
        [uuidv4(), userId, mensagem, dataAtual, false]
      );
    }
    
    logger.info(`Salvas ${recomendacoes.length} recomendações para o usuário ${userId}`);
  } catch (erro) {
    logger.error(`Erro ao salvar recomendações para o usuário ${userId}:`, erro);
    throw erro;
  }
}

/**
 * Busca as recomendações de um usuário para uma data específica
 */
export async function buscarRecomendacoes(userId: string, data?: Date): Promise<IAMensagem[]> {
  try {
    let query = `
      SELECT id, user_id as userId, mensagem, data, lida, acao
      FROM ia_mensagens
      WHERE user_id = $1
    `;
    
    const params: any[] = [userId];
    
    // Se uma data for especificada, filtrar por data
    if (data) {
      query += ` AND DATE(data) = DATE($2)`;
      params.push(data);
    }
    
    // Ordenar por data decrescente
    query += ` ORDER BY data DESC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  } catch (erro) {
    logger.error(`Erro ao buscar recomendações para o usuário ${userId}:`, erro);
    return [];
  }
}

/**
 * Marca uma recomendação como lida
 */
export async function marcarRecomendacaoComoLida(id: string): Promise<boolean> {
  try {
    await pool.query(
      `UPDATE ia_mensagens SET lida = true WHERE id = $1`,
      [id]
    );
    return true;
  } catch (erro) {
    logger.error(`Erro ao marcar recomendação ${id} como lida:`, erro);
    return false;
  }
}

// --- Funções auxiliares (simuladas) ---

/**
 * Obtém dados financeiros do usuário
 * Em um sistema real, isso buscaria do banco de dados
 */
async function obterDadosFinanceiros(userId: string): Promise<{
  saldoAtual: number;
  entradasSemana: number;
  saidasSemana: number;
}> {
  // Simulação de dados
  return {
    saldoAtual: Math.random() * 10000,
    entradasSemana: Math.random() * 2000,
    saidasSemana: Math.random() * 1500
  };
}

/**
 * Obtém itens de estoque críticos
 * Em um sistema real, isso buscaria do banco de dados
 */
async function obterItensEstoqueCritico(userId: string): Promise<string[]> {
  // Simulação de dados
  const itens = ['Farinha', 'Açúcar', 'Café', 'Leite', 'Óleo'];
  // Retorna de 0 a 3 itens aleatórios
  return itens.slice(0, Math.floor(Math.random() * 4));
}

/**
 * Obtém contas a vencer nos próximos dias
 * Em um sistema real, isso buscaria do banco de dados
 */
async function obterContasAVencer(userId: string): Promise<{
  id: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
}[]> {
  // Simulação de dados
  const hoje = new Date();
  const contas = [];
  
  // Gera de 0 a 3 contas aleatórias
  const numContas = Math.floor(Math.random() * 4);
  
  for (let i = 0; i < numContas; i++) {
    const diasAfrente = Math.floor(Math.random() * 15) + 1; // 1 a 15 dias
    const dataVencimento = new Date(hoje);
    dataVencimento.setDate(hoje.getDate() + diasAfrente);
    
    contas.push({
      id: uuidv4(),
      descricao: `Conta ${i + 1}`,
      valor: Math.random() * 500 + 50, // 50 a 550
      dataVencimento: dataVencimento.toISOString().split('T')[0]
    });
  }
  
  return contas;
}

/**
 * Verifica se o relatório mensal foi gerado
 * Em um sistema real, isso buscaria do banco de dados
 */
async function verificarRelatorioMensalGerado(userId: string): Promise<boolean> {
  // Simulação de dados
  return Math.random() > 0.5; // 50% de chance de ter gerado
} 