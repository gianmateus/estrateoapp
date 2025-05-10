/**
 * Permission Guard component that controls access to protected content based on user permissions
 * Provides redirection or fallback content when permission checks fail
 * 
 * Componente de Guarda de Permissão que controla o acesso a conteúdo protegido baseado em permissões do usuário
 * Fornece redirecionamento ou conteúdo alternativo quando as verificações de permissão falham
 */
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Interface for the PermissionGuard component props
 * 
 * Interface para as props do componente PermissionGuard
 */
interface PermissionGuardProps {
  permission: string | string[];  // Required permission(s) to access the content
                                 // Permissão(ões) necessária(s) para acessar o conteúdo
  children: ReactNode;           // Content to display if user has permission
                                // Conteúdo a ser exibido se o usuário tiver permissão
  fallback?: ReactNode;          // Optional fallback content to display if permission check fails
                                // Conteúdo alternativo opcional a ser exibido se a verificação de permissão falhar
  redirectTo?: string;           // Optional redirect path if permission check fails and no fallback is provided
                                // Caminho de redirecionamento opcional se a verificação de permissão falhar e nenhum fallback for fornecido
}

/**
 * Component that verifies if the user has permission to access content
 * If they don't have permission, it displays the fallback or redirects
 * 
 * Componente que verifica se o usuário tem permissão para acessar o conteúdo
 * Se não tiver, exibe o fallback ou redireciona
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback,
  redirectTo = '/dashboard'
}) => {
  const { checkUserPermission, isAuthenticated } = useAuth();
  
  // If user is not authenticated, redirect to login
  // Se o usuário não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has at least one of the required permissions
  // Verifica se o usuário tem pelo menos uma das permissões necessárias
  const userHasRequiredPermission = Array.isArray(permission)
    ? permission.some(perm => checkUserPermission(perm))
    : checkUserPermission(permission);
  
  // If user has permission, show the content
  // Se tiver permissão, exibe o conteúdo
  if (userHasRequiredPermission) {
    return <>{children}</>;
  }
  
  // If user lacks permission and fallback is provided, show the fallback
  // Se não tiver permissão e houver um fallback, exibe o fallback
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Otherwise, redirect to the specified path
  // Caso contrário, redireciona para o caminho especificado
  return <Navigate to={redirectTo} />;
};

export default PermissionGuard; 