/**
 * Permission-based button component that only renders when the user has the required permission
 * Supports custom component rendering and fallback content
 * 
 * Componente de botão baseado em permissões que só é renderizado quando o usuário tem a permissão necessária
 * Suporta renderização de componente personalizado e conteúdo alternativo
 */
import React, { ElementType } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

/**
 * Props interface extending Material-UI ButtonProps with permission features
 * 
 * Interface de props estendendo ButtonProps do Material-UI com recursos de permissão
 */
interface PermissionButtonProps extends ButtonProps {
  permission: string | string[];  // Required permission(s) to display the button
                                 // Permissão(ões) necessária(s) para exibir o botão
  component?: ElementType;        // Optional custom component to render instead of Button
                                 // Componente personalizado opcional para renderizar no lugar de Button
  fallback?: React.ReactNode;     // Optional content to display if permission check fails
                                 // Conteúdo opcional para exibir se a verificação de permissão falhar
}

/**
 * Button that only renders if the user has the required permission
 * Can render a fallback component if permission is missing
 * 
 * Botão que só é renderizado se o usuário tiver a permissão necessária
 * Pode renderizar um componente alternativo se a permissão estiver faltando
 */
const PermissionButton = ({
  permission,
  children,
  fallback = null,
  component: Component = Button,
  ...props
}: PermissionButtonProps) => {
  const { checkUserPermission } = useAuth();
  
  // Check if user has at least one of the required permissions
  // Verifica se o usuário tem pelo menos uma das permissões necessárias
  const userHasRequiredPermission = Array.isArray(permission)
    ? permission.some(perm => checkUserPermission(perm))
    : checkUserPermission(permission);
  
  // If user doesn't have permission, render the fallback or nothing
  // Se o usuário não tiver permissão, renderiza o fallback ou nada
  if (!userHasRequiredPermission) {
    return <>{fallback}</>;
  }
  
  // If the component is the default (Button), simply render a Button with the props
  // Se o componente for o padrão (Button), simplesmente renderiza um Button com as props
  if (Component === Button) {
    return (
      <Button {...props}>
        {children}
      </Button>
    );
  }
  
  // Otherwise, render the specified component
  // Caso contrário, renderiza o componente especificado
  return (
    <Component {...props}>
      {children}
    </Component>
  );
};

export default PermissionButton; 