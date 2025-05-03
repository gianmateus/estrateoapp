/**
 * Configuração do CORS (Cross-Origin Resource Sharing)
 * 
 * Este arquivo define quais origens (domínios) podem acessar a API,
 * implementando uma lista de permissões (whitelist) para aumentar a segurança.
 * 
 * Em ambiente de produção, apenas os domínios oficiais do Estrateo são permitidos.
 * Em ambiente de desenvolvimento, o servidor local de front-end também é permitido.
 */

import { CorsOptions } from 'cors';
import { serverConfig } from './index';

// Lista de domínios permitidos
const allowedOrigins = [
  'http://localhost:3000',     // ambiente de desenvolvimento
  'https://estrateo.io',       // domínio oficial do front-end
  'https://www.estrateo.io',   // com www (caso use)
];

// Adiciona o CLIENT_URL do .env à lista de origens permitidas (se não estiver na lista)
if (serverConfig.clientUrl && !allowedOrigins.includes(serverConfig.clientUrl)) {
  allowedOrigins.push(serverConfig.clientUrl);
}

/**
 * Opções de configuração do CORS
 * 
 * origin: função que verifica se a origem da requisição está na lista de permitidas
 * credentials: true - permite o envio de cookies e cabeçalhos de autenticação
 * methods: métodos HTTP permitidos
 * allowedHeaders: cabeçalhos personalizados permitidos
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem origem (como aplicativos móveis ou chamadas de API)
    // ou requisições de origens na lista de permitidas
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Rejeita requisições de origens não permitidas
      callback(new Error('Acesso negado por política de CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  // Expõe headers especiais para o cliente (opcional)
  exposedHeaders: ['Content-Length', 'Content-Range'],
  
  // Cache de preflights por 1 hora (performance)
  maxAge: 3600
}; 