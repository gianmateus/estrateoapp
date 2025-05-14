import axios from 'axios';
import i18n from '../i18n';

/**
 * Configuração base do Axios para as requisições da API
 */
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Interceptor para adicionar o token de autenticação e idioma às requisições
 */
api.interceptors.request.use(config => {
  // Obter token do localStorage
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Adicionar idioma atual às requisições
  config.headers['Accept-Language'] = i18n.language;
  
  return config;
});

/**
 * Interceptor para tratar erros de resposta
 */
api.interceptors.response.use(
  response => response,
  error => {
    // Tratar erros de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Redirecionar para login ou limpar dados de autenticação
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Exportação padrão para manter compatibilidade com importações existentes
export default api; 