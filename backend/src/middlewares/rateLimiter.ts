/**
 * Rate Limiter Middleware
 * 
 * Este middleware protege a API contra abusos, brute force e sobrecarga por IP,
 * limitando o número de requisições que podem ser feitas em um determinado período.
 * 
 * Configuração padrão:
 * - 100 requisições por IP a cada 15 minutos
 * - Responde com código 429 Too Many Requests quando o limite é excedido
 */

import rateLimit from 'express-rate-limit';

// Configuração padrão para todas as rotas
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de 100 requisições por IP
  message: { 
    error: true, 
    message: 'Muitas requisições deste IP, tente novamente mais tarde.' 
  },
  standardHeaders: true, // Retorna headers padrão de rate limit (RateLimit-*)
  legacyHeaders: false, // Desabilita headers legados 'X-RateLimit-*'
});

// Configuração mais restritiva para rotas sensíveis como login/registro
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo de 20 requisições por IP
  message: { 
    error: true, 
    message: 'Muitas tentativas de autenticação, tente novamente mais tarde.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Para implementações mais avançadas:
 * 
 * 1. Armazenamento distribuído com Redis (para ambientes com múltiplos servidores):
 *    Requer instalação do pacote: rate-limit-redis
 * 
 * 2. Identificação avançada (além do IP, como user agent, token, etc)
 * 
 * 3. Limitação específica por rota ou por usuário autenticado
 */ 