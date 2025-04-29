/**
 * Custom hook for permission checking
 * Provides a clean way to check user permissions across the application
 * 
 * Hook personalizado para verificação de permissões
 * Fornece uma maneira limpa de verificar permissões de usuário em toda a aplicação
 */

import { useAuth } from '../contexts/AuthContext';

/**
 * Hook that provides permission checking functionality
 * @returns Object with permission checking methods
 */
export const usePermission = () => {
  const { checkUserPermission } = useAuth();
  
  /**
   * Checks if the user has a specific permission
   * @param permission Permission or array of permissions to check
   * @returns Boolean indicating if the user has the required permission
   */
  const hasPermission = (permission: string | string[]): boolean => {
    if (Array.isArray(permission)) {
      // Check if user has at least one of the permissions in the array
      return permission.some(perm => checkUserPermission(perm));
    }
    
    // Check single permission
    return checkUserPermission(permission);
  };
  
  return { hasPermission };
};