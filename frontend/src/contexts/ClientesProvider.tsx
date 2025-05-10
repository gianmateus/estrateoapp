import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Cliente } from '../types/clienteTypes';

interface ClientesContextData {
  clientes: Cliente[];
  isLoading: boolean;
  error: Error | null;
  fetchClientes: () => Promise<void>;
  addCliente: (cliente: Cliente) => Promise<void>;
  updateCliente: (id: string, data: Partial<Cliente>) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
}

export const ClientesContext = createContext<ClientesContextData>({} as ClientesContextData);

interface ClientesProviderProps {
  children: ReactNode;
}

export const ClientesProvider: React.FC<ClientesProviderProps> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchClientes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulação de API - substituir por chamada real
      const response = await new Promise<Cliente[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              nome: 'Empresa ABC',
              tipo: 'pessoa_juridica',
              documentoPrincipal: '12.345.678/0001-99',
              email: 'contato@empresaabc.com',
              telefone: '(11) 98765-4321',
              endereco: 'Rua das Empresas, 123 - Centro, São Paulo/SP',
              website: 'www.empresaabc.com',
              segmento: 'Tecnologia',
              status: 'ativo',
              dataCadastro: new Date().toISOString(),
              dataAtualizacao: new Date().toISOString(),
              anotacoes: 'Cliente desde 2020'
            }
          ]);
        }, 500);
      });
      setClientes(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar clientes'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCliente = useCallback(async (cliente: Cliente) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulação de API - substituir por chamada real
      await new Promise((resolve) => setTimeout(resolve, 500));
      setClientes(prev => [...prev, { ...cliente, id: Date.now().toString() }]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao adicionar cliente'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCliente = useCallback(async (id: string, data: Partial<Cliente>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulação de API - substituir por chamada real
      await new Promise((resolve) => setTimeout(resolve, 500));
      setClientes(prev => 
        prev.map(cliente => 
          cliente.id === id 
            ? { ...cliente, ...data, dataAtualizacao: new Date().toISOString() } 
            : cliente
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar cliente'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCliente = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulação de API - substituir por chamada real
      await new Promise((resolve) => setTimeout(resolve, 500));
      setClientes(prev => prev.filter(cliente => cliente.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir cliente'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ClientesContext.Provider 
      value={{ 
        clientes, 
        isLoading, 
        error, 
        fetchClientes, 
        addCliente, 
        updateCliente, 
        deleteCliente 
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};

export const useClientes = () => useContext(ClientesContext); 