/**
 * System permission constants
 * Used to verify access to resources and functionalities
 * 
 * Constantes de permissões do sistema
 * Usado para verificar acesso a recursos e funcionalidades
 */

// Administrator permission (full access)
// Permissão de administrador (acesso completo)
export const ADMIN_PERMISSION = 'admin';

/**
 * Payment module permissions
 * Controls access to payment-related features
 * 
 * Permissões do módulo de Pagamentos
 * Controla acesso às funcionalidades relacionadas a pagamentos
 */
export const VIEW_PAYMENTS_PERMISSION = 'view_pagamentos';
export const CREATE_PAYMENT_PERMISSION = 'criar_pagamento';
export const EDIT_PAYMENT_PERMISSION = 'editar_pagamento';
export const DELETE_PAYMENT_PERMISSION = 'excluir_pagamento';

/**
 * Inventory module permissions
 * Controls access to inventory-related features
 * 
 * Permissões do módulo de Inventário
 * Controla acesso às funcionalidades relacionadas ao inventário
 */
export const VIEW_INVENTORY_PERMISSION = 'view_inventario';
export const CREATE_INVENTORY_PERMISSION = 'criar_inventario';
export const EDIT_INVENTORY_PERMISSION = 'editar_inventario';
export const DELETE_INVENTORY_PERMISSION = 'excluir_inventario';

/**
 * User profile permissions
 * Controls access to profile management features
 * 
 * Permissões de Perfil/Usuário
 * Controla acesso às funcionalidades de gerenciamento de perfil
 */
export const EDIT_PROFILE_PERMISSION = 'editar_perfil';
export const VIEW_PROFILE_PERMISSION = 'view_perfil';

/**
 * Dashboard permissions
 * Controls access to the main dashboard
 * 
 * Permissões de Dashboard
 * Controla acesso ao painel principal
 */
export const VIEW_DASHBOARD_PERMISSION = 'view_dashboard';

/**
 * Permission groups to facilitate management
 * Groups of related permissions for easier assignment
 * 
 * Grupos de permissões para facilitar o gerenciamento
 * Grupos de permissões relacionadas para atribuição mais fácil
 */
export const FULL_PAYMENT_PERMISSIONS = [
  VIEW_PAYMENTS_PERMISSION,
  CREATE_PAYMENT_PERMISSION,
  EDIT_PAYMENT_PERMISSION,
  DELETE_PAYMENT_PERMISSION
];

export const FULL_INVENTORY_PERMISSIONS = [
  VIEW_INVENTORY_PERMISSION,
  CREATE_INVENTORY_PERMISSION,
  EDIT_INVENTORY_PERMISSION,
  DELETE_INVENTORY_PERMISSION
];

/**
 * Default permissions for regular users
 * Base set of permissions assigned to newly created accounts
 * 
 * Permissões padrão para usuários comuns
 * Conjunto básico de permissões atribuídas a contas recém-criadas
 */
export const DEFAULT_USER_PERMISSIONS = [
  VIEW_PAYMENTS_PERMISSION,
  CREATE_PAYMENT_PERMISSION,
  EDIT_PAYMENT_PERMISSION,
  VIEW_INVENTORY_PERMISSION,
  CREATE_INVENTORY_PERMISSION,
  EDIT_INVENTORY_PERMISSION,
  EDIT_PROFILE_PERMISSION,
  VIEW_PROFILE_PERMISSION,
  VIEW_DASHBOARD_PERMISSION
]; 