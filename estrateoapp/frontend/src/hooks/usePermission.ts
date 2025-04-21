import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_PERMISSION } from '../constants/permissions';

/**
 * Custom hook for permission verification
 * Makes permission checks easier in components
 * 
 * Hook personalizado para verificação de permissões
 * Facilita a verificação de permissões em componentes
 */
export default function usePermission() {
  const { hasPermission, user } = useAuth();

  /**
   * Checks if the user has all the specified permissions
   * @param permissions A permission or array of permissions to check
   * @returns True if the user has all permissions
   * 
   * Verifica se o usuário tem todas as permissões especificadas
   * @param permissions Uma permissão ou array de permissões para verificar
   * @returns Verdadeiro se o usuário tiver todas as permissões
   */
  const hasAllPermissions = useCallback((permissions: string | string[]): boolean => {
    // If there's no user, no permission
    // Se não há usuário, não tem permissão
    if (!user) return false;
    
    // If admin, has all permissions
    // Se é admin, tem todas as permissões
    if (user.permissoes.includes(ADMIN_PERMISSION)) return true;
    
    // If it's a single permission
    // Se for uma única permissão
    if (typeof permissions === 'string') {
      return hasPermission(permissions);
    }
    
    // If it's an array, check if has all
    // Se for um array, verifica se tem todas
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission, user]);

  /**
   * Checks if the user has any of the specified permissions
   * @param permissions A permission or array of permissions to check
   * @returns True if the user has at least one of the permissions
   * 
   * Verifica se o usuário tem pelo menos uma das permissões especificadas
   * @param permissions Uma permissão ou array de permissões para verificar
   * @returns Verdadeiro se o usuário tiver pelo menos uma das permissões
   */
  const hasAnyPermission = useCallback((permissions: string | string[]): boolean => {
    // If there's no user, no permission
    // Se não há usuário, não tem permissão
    if (!user) return false;
    
    // If admin, has all permissions
    // Se é admin, tem todas as permissões
    if (user.permissoes.includes(ADMIN_PERMISSION)) return true;
    
    // If it's a single permission
    // Se for uma única permissão
    if (typeof permissions === 'string') {
      return hasPermission(permissions);
    }
    
    // If it's an array, check if has at least one
    // Se for um array, verifica se tem pelo menos uma
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission, user]);

  /**
   * Checks if the user is an administrator
   * @returns True if the user is an administrator
   * 
   * Verifica se o usuário é administrador
   * @returns Verdadeiro se o usuário for administrador
   */
  const isAdmin = useCallback((): boolean => {
    if (!user) return false;
    return user.permissoes.includes(ADMIN_PERMISSION);
  }, [user]);

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isAdmin
  };
} 