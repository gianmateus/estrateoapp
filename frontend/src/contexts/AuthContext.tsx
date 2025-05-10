/**
 * Contexto de autenticação para gerenciar o estado do usuário e funções de autenticação
 * Authentication context to manage user state and authentication functions
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User } from '../types/User';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * Interface do contexto de autenticação com métodos e propriedades disponíveis
 * Authentication context interface with available methods and properties
 */
interface AuthContextType {
  // Current user properties
  currentUser: User | null;
  user: User | null; // Alias for currentUser for compatibility
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Authentication methods
  authenticateUser: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>; // Alias for authenticateUser
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut
  verifyAuthentication: () => Promise<boolean>;
  
  // Permission methods
  checkUserPermission: (permission: string) => boolean;
  hasPermission: (permission: string) => boolean; // Alias for checkUserPermission
  
  // Theme toggle function
  toggleTheme?: () => void;
}

/**
 * Criação do contexto de autenticação
 * Creation of the authentication context
 */
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/**
 * Hook personalizado para acessar o contexto de autenticação
 * Custom hook to access the authentication context
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Interface de propriedades do provedor de autenticação
 * Authentication provider props interface
 */
interface AuthProviderProps {
  children: ReactNode;   // Componentes filhos | Child components
}

/**
 * Provedor de autenticação que gerencia o estado de autenticação e fornece funções relacionadas
 * Authentication provider that manages authentication state and provides related functions
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  /**
   * Efeito para verificar se o usuário já está autenticado ao carregar a página
   * Effect to check if the user is already authenticated when loading the page
   */
  useEffect(() => {
    const checkAuthState = async () => {
      // TODO: Reativar autenticação após ajustes no dashboard.
      // Verificar se existe um usuário simulado no localStorage
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedUser) {
        try {
          // Usar o usuário simulado
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Erro ao fazer parse do usuário armazenado:', e);
          // Limpar localStorage em caso de erro
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      
      // Lógica original se não houver usuário simulado
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setCurrentUser(response.data.user || response.data);
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      setIsLoading(false);
    };
    
    checkAuthState();
  }, []);

  /**
   * Função para verificar autenticação
   * Function to check authentication status
   * 
   * @returns Promise<boolean> Retorna true se autenticado, false caso contrário
   */
  const verifyAuthentication = async (): Promise<boolean> => {
    // TODO: Reativar autenticação após ajustes no dashboard.
    // Verificar se existe um usuário simulado para bypass
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        return true;
      } catch (e) {
        console.error('Erro ao fazer parse do usuário armazenado:', e);
      }
    }
    
    // Lógica original
    try {
      const response = await api.get('/auth/me');
      setCurrentUser(response.data.user || response.data);
      return true;
    } catch (error) {
      setCurrentUser(null);
      return false;
    }
  };

  /**
   * Função para autenticar o usuário
   * Function to authenticate the user
   * 
   * @param email - Email do usuário | User email
   * @param password - Senha do usuário | User password
   * @returns Promise com resultado da autenticação | Promise with authentication result
   */
  const authenticateUser = async (email: string, password: string): Promise<{success: boolean; message?: string}> => {
    setIsLoading(true);
    
    // TODO: Reativar autenticação após ajustes no dashboard.
    // Bypass de autenticação - aceitar qualquer credencial
    const demoUser = {
      id: '1',
      nome: 'Administrador',
      email: email || 'admin@estrateo.com',
      cargo: 'Administrador',
      permissoes: [
        'admin', 
        'view_dashboard', 
        'view_pagamentos',
        'view_inventario', 
        'view_perfil',
        'financeiro.visualizar',
        'inventario.visualizar',
        'impostos.visualizar',
        'pagamentos.visualizar',
        'calendario.visualizar',
        'funcionarios.visualizar',
        'ia.visualizar'
      ]
    };
    
    // Salvar no localStorage
    localStorage.setItem('auth_token', 'bypass_token_temporary');
    localStorage.setItem('auth_user', JSON.stringify(demoUser));
    
    // Definir usuário atual
    setCurrentUser(demoUser);
    setIsLoading(false);
    
    return { success: true };
    
    // Código original comentado para referência futura
    /*
    // Modo de demonstração para permitir login sem backend
    if (email === 'admin@restaurante.com' && password === 'Admin@123') {
      // Usuário de demonstração
      const demoUser = {
        id: '1',
        nome: 'Administrador',
        email: 'admin@restaurante.com',
        cargo: 'Administrador',
        permissoes: ['admin', 'view_dashboard', 'view_pagamentos', 'view_inventario', 'view_perfil']
      };
      
      // Simular token JWT
      const demoToken = 'demo_token_estrateo_app';
      
      // Armazenar dados no localStorage
      localStorage.setItem('auth_token', demoToken);
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      
      // Definir usuário atual
      setCurrentUser(demoUser);
      setIsLoading(false);
      
      return { success: true };
    }
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        setCurrentUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: t('auth.invalidResponse')
        };
      }
    } catch (error: any) {
      console.error('Erro durante o login:', error);
      
      // Traduzir mensagens de erro comuns
      let errorMessage: string;
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = t('auth.invalidCredentials');
        } else if (error.response.status >= 500) {
          errorMessage = t('auth.serverError');
        } else {
          errorMessage = error.response.data?.message || t('auth.unknownError');
        }
      } else if (error.request) {
        // Network error handling - when request was made but no response received
        // Tratamento de erro de rede - quando a requisição foi feita mas não houve resposta
        errorMessage = "Network error. Please try again later.";
      } else {
        errorMessage = t('auth.unknownError');
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
    */
  };

  /**
   * Função para deslogar o usuário
   * Function to logout the user
   */
  const signOut = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setCurrentUser(null);
    navigate('/login');
  };
  
  /**
   * Verifica se o usuário possui uma permissão específica
   * Checks if the user has a specific permission
   * 
   * @param permission - Permissão a ser verificada | Permission to be checked
   * @returns true se o usuário tem a permissão, false caso contrário | true if user has permission, false otherwise
   */
  const checkUserPermission = (permission: string): boolean => {
    // TODO: Reativar autenticação após ajustes no dashboard.
    // Para bypass, considerar que o usuário tem todas as permissões
    return true;
    
    // Código original comentado
    /*
    if (!currentUser) return false;
    return currentUser.permissoes.includes(permission) || currentUser.permissoes.includes('admin');
    */
  };
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser, // Alias for currentUser
        isAuthenticated: !!currentUser,
        isLoading,
        authenticateUser,
        login: authenticateUser, // Alias for authenticateUser
        signOut,
        logout: signOut, // Alias for signOut
        verifyAuthentication,
        checkUserPermission,
        hasPermission: checkUserPermission, // Alias for checkUserPermission
        toggleTheme: () => {} // Placeholder for toggleTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;