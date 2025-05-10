const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const winston = require('winston');
const expressWinston = require('express-winston');
const basicAuth = require('express-basic-auth');
const fs = require('fs');
const NodeCache = require('node-cache');

// Configuração do logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'openai-proxy' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

// Criar pasta de logs se não existir
try {
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
  }
} catch (error) {
  console.error('Erro ao criar pasta de logs:', error);
}

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Cache com persistência em arquivo
const CACHE_TTL = 60 * 60; // 1 hora em segundos
const apiCache = new NodeCache({ 
  stdTTL: CACHE_TTL,
  checkperiod: 120, 
  useClones: false 
});

// Carregar cache do arquivo ao iniciar
try {
  if (fs.existsSync('data/api-cache.json')) {
    const cacheData = JSON.parse(fs.readFileSync('data/api-cache.json', 'utf8'));
    Object.keys(cacheData).forEach(key => {
      apiCache.set(key, cacheData[key].data, cacheData[key].ttl);
    });
    logger.info(`Cache carregado com ${Object.keys(cacheData).length} itens`);
  }
} catch (error) {
  logger.error('Erro ao carregar cache:', error);
}

// Salvar cache periodicamente
setInterval(() => {
  try {
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data');
    }
    
    const cacheData = {};
    const keys = apiCache.keys();
    
    keys.forEach(key => {
      const value = apiCache.get(key);
      const ttl = apiCache.getTtl(key);
      cacheData[key] = { data: value, ttl };
    });
    
    fs.writeFileSync('data/api-cache.json', JSON.stringify(cacheData));
    logger.info(`Cache salvo com ${keys.length} itens`);
  } catch (error) {
    logger.error('Erro ao salvar cache:', error);
  }
}, 15 * 60 * 1000); // A cada 15 minutos

const app = express();
const PORT = process.env.PORT || 3001;
const API_URL = 'https://api.openai.com/v1/chat/completions';

// API key da OpenAI no servidor
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mudar123';
const MAX_REQUESTS_PER_HOUR = process.env.MAX_REQUESTS_PER_HOUR || 100;
const ENABLE_AUTHENTICATION = process.env.ENABLE_AUTHENTICATION === 'true';
const ENABLE_RATE_LIMIT = process.env.ENABLE_RATE_LIMIT === 'true';

// Validar configurações críticas
if (!OPENAI_API_KEY) {
  logger.error('ERRO: Chave da API OpenAI não configurada no servidor!');
  logger.error('Por favor, configure a variável OPENAI_API_KEY no arquivo .env');
  process.exit(1);
}

// Contador de uso
let usageStats = {
  totalRequests: 0,
  successRequests: 0,
  failedRequests: 0,
  tokensUsed: 0,
  lastReset: Date.now()
};

// Resetar estatísticas diariamente
setInterval(() => {
  const lastStats = { ...usageStats };
  usageStats = {
    totalRequests: 0,
    successRequests: 0,
    failedRequests: 0,
    tokensUsed: 0,
    lastReset: Date.now()
  };
  logger.info('Estatísticas de uso resetadas', { previousStats: lastStats });
}, 24 * 60 * 60 * 1000); // 24 horas

// Middleware de segurança
app.use(helmet());

// Logging de requisições
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
}));

// CORS configurável
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 horas
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '2mb' }));

// Autenticação para rotas admin
const adminAuth = basicAuth({
  users: { [ADMIN_USER]: ADMIN_PASSWORD },
  challenge: true,
  realm: 'Área Administrativa'
});

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: MAX_REQUESTS_PER_HOUR,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Muitas requisições. Tente novamente mais tarde.',
    type: 'rate_limit_error'
  }
});

// Middleware de autenticação para API se habilitado
const checkApiAuth = (req, res, next) => {
  if (!ENABLE_AUTHENTICATION) {
    return next();
  }
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        message: 'Autorização necessária para acessar esta API',
        type: 'auth_error'
      }
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Usar uma chave simples para desenvolvimento
  // Em produção, deve-se implementar um sistema mais robusto de autenticação
  if (token !== process.env.API_SECRET_KEY) {
    return res.status(401).json({
      error: {
        message: 'Token de autorização inválido',
        type: 'auth_error'
      }
    });
  }
  
  next();
};

// Aplicar rate limit se habilitado
if (ENABLE_RATE_LIMIT) {
  app.use('/api/openai', apiLimiter);
}

// Middleware para calcular uso de tokens (estimativa básica)
const estimateTokenUsage = (messages) => {
  let totalTokens = 0;
  
  // Estimativa simples: ~4 tokens por palavra
  messages.forEach(msg => {
    const content = msg.content || '';
    const words = content.split(/\s+/).length;
    totalTokens += words * 4;
  });
  
  return totalTokens;
};

// Função para gerar chave de cache
const generateCacheKey = (body) => {
  const { model, messages, temperature } = body;
  // Criar uma chave baseada nos parâmetros da requisição
  return `${model}:${temperature}:${JSON.stringify(messages)}`;
};

// Rota de proxy para a API da OpenAI
app.post('/api/openai/chat', checkApiAuth, async (req, res) => {
  const startTime = Date.now();
  usageStats.totalRequests++;
  
  try {
    const { model, messages, temperature, max_tokens } = req.body;
    
    // Verificar parâmetros obrigatórios
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      usageStats.failedRequests++;
      return res.status(400).json({
        error: {
          message: 'Parâmetros inválidos: "messages" é obrigatório e deve ser um array não vazio',
          type: 'invalid_request_error'
        }
      });
    }
    
    // Verificar cache
    const cacheKey = generateCacheKey(req.body);
    const cachedResponse = apiCache.get(cacheKey);
    
    if (cachedResponse) {
      logger.info('Resposta obtida do cache', { 
        model, 
        cacheKey,
        responseTime: Date.now() - startTime 
      });
      return res.json(cachedResponse);
    }
    
    // Estimar uso de tokens
    const estimatedTokens = estimateTokenUsage(messages);
    logger.info(`Nova requisição - Modelo: ${model}, Tokens estimados: ${estimatedTokens}`);
    
    const response = await axios.post(
      API_URL,
      {
        model: model || 'gpt-3.5-turbo',
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    // Capturar tokens usados das estatísticas da API
    const tokensUsed = response.data.usage?.total_tokens || estimatedTokens;
    usageStats.tokensUsed += tokensUsed;
    usageStats.successRequests++;
    
    // Salvar resposta no cache
    apiCache.set(cacheKey, response.data);
    
    // Log de sucesso
    logger.info('Requisição processada com sucesso', {
      model,
      tokens: tokensUsed,
      responseTime: Date.now() - startTime
    });
    
    // Enviar resposta ao cliente
    res.json(response.data);
    
  } catch (error) {
    usageStats.failedRequests++;
    logger.error('Erro na requisição à OpenAI:', { 
      error: error.message,
      stack: error.stack,
      responseTime: Date.now() - startTime
    });
    
    // Enviar mensagem de erro amigável sem expor detalhes da API
    if (error.response) {
      const statusCode = error.response.status;
      let errorMessage = 'Ocorreu um erro ao processar sua solicitação.';
      let errorType = 'proxy_error';
      
      // Mensagens mais específicas para erros comuns
      if (statusCode === 401) {
        errorMessage = 'Erro de autenticação com a API OpenAI.';
        errorType = 'auth_error';
      } else if (statusCode === 429) {
        errorMessage = 'Limite de requisições excedido. Tente novamente mais tarde.';
        errorType = 'rate_limit_error';
      } else if (statusCode >= 500) {
        errorMessage = 'O serviço OpenAI está temporariamente indisponível.';
        errorType = 'service_unavailable';
      }
      
      return res.status(statusCode).json({
        error: {
          message: errorMessage,
          code: statusCode,
          type: errorType
        }
      });
    }
    
    res.status(500).json({
      error: {
        message: 'Erro interno do servidor ao conectar com a API de IA.',
        type: 'server_error'
      }
    });
  }
});

// Rota de teste/status
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'Proxy da API OpenAI funcionando!',
    config: {
      rateLimit: ENABLE_RATE_LIMIT ? `${MAX_REQUESTS_PER_HOUR} requisições/hora` : 'Desabilitado',
      authentication: ENABLE_AUTHENTICATION ? 'Habilitada' : 'Desabilitada',
      cacheEnabled: true,
      cacheItems: apiCache.keys().length
    }
  });
});

// Rota de estatísticas (protegida)
app.get('/api/admin/stats', adminAuth, (req, res) => {
  res.json({
    stats: usageStats,
    uptime: process.uptime(),
    cacheInfo: {
      items: apiCache.keys().length,
      hits: apiCache.getStats().hits,
      misses: apiCache.getStats().misses
    }
  });
});

// Rota para limpar o cache (protegida)
app.post('/api/admin/clear-cache', adminAuth, (req, res) => {
  apiCache.flushAll();
  logger.info('Cache limpo manualmente');
  res.json({ success: true, message: 'Cache limpo com sucesso' });
});

// Middleware de logging de erros
app.use(expressWinston.errorLogger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} {{err.message}}',
  expressFormat: true,
  colorize: false,
}));

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor proxy para OpenAI rodando na porta ${PORT}`);
  logger.info(`Acesse http://localhost:${PORT}/api/status para verificar o status`);
}); 