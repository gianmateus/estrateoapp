// Arquivo de exportação de configurações
// As configurações específicas serão implementadas posteriormente

export {};

// Centraliza a configuração para variáveis de ambiente 
// para fácil acesso e validação em toda a aplicação

// JWT e autenticação
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  resetSecret: process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET,
  resetExpiresIn: '1h' // Token de reset de senha expira em 1 hora
};

// Conexão com banco de dados 
export const databaseConfig = {
  url: process.env.DATABASE_URL
};

// Configuração do servidor
export const serverConfig = {
  port: process.env.PORT || 3333,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development'
};

// Configuração de email (para futuras implementações)
export const emailConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASS,
  from: process.env.EMAIL_FROM || 'noreply@estrateo.com',
  secure: process.env.SMTP_SECURE === 'true' // TLS
};

// Função para validar configurações obrigatórias
export function validateRequiredConfigs() {
  const missingEnvVars = [];
  
  if (!jwtConfig.secret) missingEnvVars.push('JWT_SECRET');
  if (!databaseConfig.url) missingEnvVars.push('DATABASE_URL');
  
  if (missingEnvVars.length > 0) {
    console.error(`⚠️ Variáveis de ambiente obrigatórias não definidas: ${missingEnvVars.join(', ')}`);
    console.error('Por favor, defina as variáveis no arquivo .env');
    return false;
  }
  
  return true;
}

// Exporta configurações do CORS
export * from './corsOptions'; 