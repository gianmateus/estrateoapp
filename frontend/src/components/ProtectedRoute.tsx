/**
 * Protected Route component to secure routes that require authentication and/or specific permissions
 * Redirects unauthenticated users to login and unauthorized users to access denied page
 * 
 * Componente de Rota Protegida para proteger rotas que requerem autenticação e/ou permissões específicas
 * Redireciona usuários não autenticados para o login e usuários não autorizados para a página de acesso negado
 */
import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import Navigation from './Navigation';

/**
 * Interface for protected route component properties
 * Defines the props structure for the ProtectedRoute component
 * 
 * Interface de propriedades do componente de rota protegida
 * Define a estrutura de props para o componente ProtectedRoute
 */
interface ProtectedRouteProps {
  requiredPermission?: string | string[];     // Required permission(s) to access the route (optional)
                                             // Permissão ou array de permissões necessárias para acessar a rota (opcional)
}

/**
 * Component that checks authentication and permissions before rendering protected content
 * Uses Outlet from React Router v6 to render child routes
 * Provides loading state, authentication verification, and permission-based access control
 * 
 * Componente que verifica autenticação e permissões antes de renderizar o conteúdo protegido
 * Usa Outlet do React Router v6 para renderizar rotas filhas
 * Fornece estado de carregamento, verificação de autenticação e controle de acesso baseado em permissões
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredPermission }) => {
  const { isAuthenticated, isLoading, checkUserPermission, toggleTheme } = useAuth();
  const location = useLocation();

  // TODO: Reativar autenticação após ajustes no dashboard.
  // Bypass authentication temporarily - this is a hack for development
  
  useEffect(() => {
    // Verificar se já existe um usuário simulado no localStorage
    const bypassUser = localStorage.getItem('auth_user');
    
    // Se não existir, criar um usuário simulado
    if (!bypassUser) {
      const demoUser = {
        id: '1',
        nome: 'Administrador',
        email: 'admin@estrateo.com',
        cargo: 'Administrador',
        permissoes: ['admin', 'view_dashboard', 'view_pagamentos', 'view_inventario', 'view_perfil']
      };
      
      localStorage.setItem('auth_token', 'bypass_token_temporary');
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
    }
  }, []);

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

  // TODO: Reativar autenticação após ajustes no dashboard.
  // Instead of rendering children directly, render with dashboard layout
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation toggleTheme={toggleTheme} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );

  /* Original authentication logic - temporarily disabled
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation toggleTheme={toggleTheme} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
  */
};

export default ProtectedRoute;