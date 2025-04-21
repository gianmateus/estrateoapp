import apiClient from './api';
// Remover importação conflitante
// import { User } from '../types/User';
import { useTranslation } from 'react-i18next';

// Interface para o usuário retornado pela API
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  // Adicione outros campos que você espera receber do back-end
}

// Interface para a resposta de login
interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
  message: string;
}

// Tipos de erro que podem ocorrer
export type AuthError = 'invalid_credentials' | 'server_error' | 'network_error';

/**
 * Tipo de resposta da API para autenticação
 */
interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
}

/**
 * Serviço de autenticação para interagir com a API
 */
const authenticationService = {
  /**
   * Realiza o login do usuário
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Dados do usuário e token JWT
   */
  async authenticateUser(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns Dados do usuário autenticado
   */
  async verifyAuthentication(): Promise<AuthenticatedUser> {
    const response = await apiClient.get<AuthenticatedUser>('/auth/me');
    return response.data;
  },

  /**
   * Realiza o logout do usuário
   */
  signOut(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    // Redireciona para a página de login
    window.location.href = '/login';
  },
  
  // Verificar se o usuário está autenticado
  checkIsAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
  
  // Obter o usuário atual
  getAuthenticatedUser(): AuthenticatedUser | null {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as AuthenticatedUser;
    } catch (e) {
      console.error('Erro ao processar dados do usuário:', e);
      return null;
    }
  },
  
  // Obter o token atual
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }
};

export default authenticationService; 