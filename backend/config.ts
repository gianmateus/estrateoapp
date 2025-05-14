/**
 * Configurações da aplicação
 */
export const config = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
  },
  
  // Configurações da API do OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
  },
  
  // Configurações do banco de dados
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'estrateo',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  
  // Configurações de internacionalização
  i18n: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'pt', 'de', 'it'],
  },
  
  // Configurações do agendador
  scheduler: {
    recomendacoesDiarias: '0 9 * * *', // Todos os dias às 9h
    timezone: 'Europe/Berlin',
  },
}; 