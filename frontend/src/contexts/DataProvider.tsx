import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { FinanceiroProvider } from './FinanceiroContext';
import { InventarioProvider } from './InventarioContext';
import { ImpostosProvider } from './ImpostosContext';

/**
 * Props for the application context providers
 * Props para os provedores de contexto da aplicação
 */
interface ApplicationContextProviderProps {
  children: ReactNode;
}

/**
 * Main application context provider that combines all context providers
 * Provedor de contexto principal da aplicação que combina todos os provedores de contexto
 */
export const ApplicationContextProvider: React.FC<ApplicationContextProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <FinanceiroProvider>
        <InventarioProvider>
          <ImpostosProvider>
            {children}
          </ImpostosProvider>
        </InventarioProvider>
      </FinanceiroProvider>
    </AuthProvider>
  );
};

// Export DataProvider as an alias for ApplicationContextProvider for backward compatibility
// Exportar DataProvider como um alias para ApplicationContextProvider para compatibilidade
export const DataProvider = ApplicationContextProvider;

export default ApplicationContextProvider; 