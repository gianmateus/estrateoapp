import React, { ReactNode } from 'react';
import { FinanceiroProvider } from './FinanceiroContext';
import { InventarioProvider } from './InventarioContext';

/**
 * Props for the application context providers
 * Defines the props received by context providers
 * 
 * Props para os provedores de contexto da aplicação
 * Define as props recebidas pelos provedores de contexto
 */
interface DataProviderProps {
  children: ReactNode;
}

/**
 * Combines multiple context providers
 * Wraps all the application providers in a single component
 * 
 * Combina múltiplos provedores de contexto
 * Envolve todos os provedores da aplicação em um único componente
 */
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  return (
    <FinanceiroProvider>
      <InventarioProvider>
        {children}
      </InventarioProvider>
    </FinanceiroProvider>
  );
};

export default DataProvider; 