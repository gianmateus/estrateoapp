/**
 * Protected Route component to secure routes that require authentication and/or specific permissions
 * Redirects unauthenticated users to login and unauthorized users to access denied page
 * 
 * Componente de Rota Protegida para proteger rotas que requerem autenticação e/ou permissões específicas
 * Redireciona usuários não autenticados para o login e usuários não autorizados para a página de acesso negado
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * Interface for protected route component properties
 * Defines the props structure for the ProtectedRoute component
 * 
 * Interface de propriedades do componente de rota protegida
 * Define a estrutura de props para o componente ProtectedRoute
 */
interface ProtectedRouteProps {
  children: React.ReactNode;       // Child components to be rendered if access is granted
                                  // Componentes filhos a serem renderizados se o acesso for concedido
  requiredPermission?: string | string[];     // Required permission(s) to access the route (optional)
                                             // Permissão ou array de permissões necessárias para acessar a rota (opcional)
}

/**
 * Component that checks authentication and permissions before rendering protected content
 * Provides loading state, authentication verification, and permission-based access control
 * 
 * Componente que verifica autenticação e permissões antes de renderizar o conteúdo protegido
 * Fornece estado de carregamento, verificação de autenticação e controle de acesso baseado em permissões
 */
const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, checkUserPermission } = useAuth();
  const location = useLocation();

  /**
   * Show loading indicator while checking authentication
   * Displays a centered circular progress indicator
   * 
   * Mostrar indicador de carregamento enquanto verifica a autenticação
   * Exibe um indicador de progresso circular centralizado
   */
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  /**
   * Redirect to login if not authenticated
   * Preserves the original location for redirecting back after login
   * 
   * Redirecionar para login se não estiver autenticado
   * Preserva a localização original para redirecionar de volta após o login
   */
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /**
   * Check specific permission if required
   * Redirects to access denied page if user lacks the necessary permission
   * 
   * Verificar permissão específica se necessário
   * Redireciona para a página de acesso negado se o usuário não tiver a permissão necessária
   */
  if (requiredPermission) {
    // Check if it's an array of permissions or a single permission
    // Verifica se é um array de permissões ou uma permissão única
    const userHasAccess = Array.isArray(requiredPermission)
      ? requiredPermission.some(perm => checkUserPermission(perm))
      : checkUserPermission(requiredPermission);
      
    if (!userHasAccess) {
      return <Navigate to="/acesso-negado" replace />;
    }
  }

  /**
   * Render protected content if all checks pass
   * Returns the children components when user is authenticated and authorized
   * 
   * Renderizar o conteúdo protegido se todas as verificações passarem
   * Retorna os componentes filhos quando o usuário está autenticado e autorizado
   */
  return <>{children}</>;
};

export default ProtectedRoute;