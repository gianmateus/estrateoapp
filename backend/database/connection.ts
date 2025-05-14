import { Pool } from 'pg';
import { config } from '../config';
import { logger } from '../utils/logger';

// Configuração do pool de conexões com o banco de dados
export const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: 20, // Máximo de clientes no pool
  idleTimeoutMillis: 30000, // Tempo de inatividade antes de desconectar
  connectionTimeoutMillis: 2000, // Tempo limite para conectar
});

// Evento disparado quando um cliente é criado
pool.on('connect', () => {
  logger.debug('Nova conexão com o banco de dados estabelecida');
});

// Evento disparado quando um erro ocorre
pool.on('error', (err) => {
  logger.error('Erro no pool de conexões com o banco de dados:', err);
});

/**
 * Inicializa a conexão com o banco de dados
 */
export async function inicializarConexao(): Promise<void> {
  try {
    // Testa a conexão
    const client = await pool.connect();
    logger.info('Conexão com o banco de dados estabelecida com sucesso!');
    client.release();
  } catch (erro) {
    logger.error('Erro ao conectar ao banco de dados:', erro);
    throw erro;
  }
}

/**
 * Encerra a conexão com o banco de dados
 */
export async function encerrarConexao(): Promise<void> {
  try {
    await pool.end();
    logger.info('Conexão com o banco de dados encerrada com sucesso!');
  } catch (erro) {
    logger.error('Erro ao encerrar conexão com o banco de dados:', erro);
    throw erro;
  }
} 