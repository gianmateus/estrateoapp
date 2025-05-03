import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { initializeAllListeners } from './services/sincronizacao';
import { serverConfig, validateRequiredConfigs, corsOptions } from './config';
import { limiter } from './middlewares';

// Carrega variáveis de ambiente
dotenv.config();

// Valida configurações obrigatórias
if (!validateRequiredConfigs()) {
  console.error('Iniciando com configurações incompletas. Algumas funcionalidades podem não funcionar corretamente.');
}

const app = express();
const port = serverConfig.port;

// Configuração do middleware CORS com opções seguras
app.use(cors(corsOptions));

// Middleware JSON parser
app.use(express.json());

// Aplicar rate limiting em todas as rotas
app.use(limiter);

// Middleware para tratamento de erros de CORS
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: true,
      message: 'Acesso bloqueado: origem não permitida',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  next(err);
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rotas da API
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Estrateo funcionando!' });
});

// Inicializa os listeners de eventos para sincronização entre módulos
initializeAllListeners();

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Ambiente: ${serverConfig.environment}`);
  console.log('Sistema de eventos inicializado e pronto para sincronização entre módulos');
}); 