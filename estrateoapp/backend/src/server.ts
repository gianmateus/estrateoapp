import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

// Middleware
app.use(cors());
app.use(express.json());

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

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
}); 