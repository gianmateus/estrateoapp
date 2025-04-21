import axios from 'axios';

// Criando uma instância do axios com a URL base da API
const apiClient = axios.create({
  baseURL: 'http://localhost:3333/api'
});

// Interceptor para adicionar o token JWT em todas as requisições
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para tratamento de erros nas respostas
apiClient.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    // Se o token expirou (401) ou não tem permissão (403)
    if (response && (response.status === 401 || response.status === 403)) {
      // Redirecionar para login se o token for inválido
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 