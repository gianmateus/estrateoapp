import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Utilizamos console em vez de toast até que o react-hot-toast esteja instalado
import toast from 'react-hot-toast';
import useSWR from 'swr';
import api from '../services/api';
import { useAuth } from './AuthContext';

// Interface para o perfil fiscal
export interface TaxProfile {
  id: string;
  companyId: string;
  legalForm: string;
  municipality: string;
  hebesatz: number;
  vatScheme: string;
  employeesCount: number;
  taxNumber?: string;
  vatId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contexto do perfil fiscal
interface TaxProfileContextType {
  taxProfile: TaxProfile | null;
  isLoading: boolean;
  error: any;
  updateTaxProfile: (data: Partial<TaxProfile>) => Promise<void>;
  isTaxProfileComplete: boolean;
}

// Mock de dados de perfil fiscal para uso quando a API não está disponível
const mockTaxProfileData: TaxProfile = {
  id: 'mock-profile-id',
  companyId: 'mock-company-id',
  legalForm: 'GmbH',
  municipality: 'Berlin',
  hebesatz: 410,
  vatScheme: 'regular',
  employeesCount: 5,
  taxNumber: 'DE123456789',
  vatId: 'DE987654321',
  createdAt: new Date(),
  updatedAt: new Date()
};

const TaxProfileContext = createContext<TaxProfileContextType | undefined>(undefined);

// Hook para usar o contexto de perfil fiscal
export function useTaxProfile() {
  const context = useContext(TaxProfileContext);
  if (context === undefined) {
    throw new Error('useTaxProfile deve ser usado dentro de um TaxProfileProvider');
  }
  return context;
}

interface TaxProfileProviderProps {
  children: ReactNode;
}

// Provider do contexto de perfil fiscal
export function TaxProfileProvider({ children }: TaxProfileProviderProps) {
  const { user } = useAuth();
  // Usar um ID simulado pois empresaId não existe no tipo User
  const companyId = 'default-company';
  
  // Estado para armazenar dados de mock quando a API falha
  const [mockData, setMockData] = useState<TaxProfile | null>(null);
  // Flag para indicar quando estamos usando dados de mock
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Tempo limite para mostrar o loading state (5 segundos)
  const LOADING_TIMEOUT = 5000;

  // Usar SWR para buscar e manter sincronizado o perfil fiscal
  const { data, error, mutate } = useSWR<TaxProfile>(
    user && !usingMockData ? `/companies/${companyId}/tax-profile` : null,
    async (url) => {
      try {
        const response = await api.get(url);
        setUsingMockData(false);
        return response.data;
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error('Erro ao buscar perfil fiscal:', err);
        }
        return null;
      }
    }
  );
  
  // Efeito para verificar se os dados estão demorando muito para carregar
  // e aplicar o mock se necessário
  useEffect(() => {
    if (user && !data && !error && !usingMockData) {
      // Definir um timeout para verificar se os dados foram carregados
      const timeoutId = setTimeout(() => {
        if (!data && !error) {
          console.log('Usando dados fictícios de perfil fiscal devido a timeout na API');
          setUsingMockData(true);
          // Criar uma cópia dos dados de mock para evitar compartilhamento de estado
          setMockData({ ...mockTaxProfileData });
          toast.success('Carregado dados de exemplo para o perfil fiscal');
        }
      }, LOADING_TIMEOUT);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, data, error, usingMockData]);

  // Verificar se o perfil fiscal está completo
  const profileToUse = data || mockData;
  const isTaxProfileComplete = !!profileToUse && 
    !!profileToUse.legalForm && 
    !!profileToUse.municipality && 
    !!profileToUse.hebesatz && 
    !!profileToUse.vatScheme;

  // Função para atualizar o perfil fiscal
  const updateTaxProfile = async (newData: Partial<TaxProfile>) => {
    try {
      if (usingMockData) {
        // Se estamos usando dados de mock, atualizamos apenas o estado local
        const updatedMockData = { ...mockData, ...newData, updatedAt: new Date() } as TaxProfile;
        setMockData(updatedMockData);
        toast.success('Perfil fiscal atualizado com sucesso');
        return;
      }
      
      // Otimistic update - Se data for null, não faz nada
      if (data) {
        const updatedProfile = { ...data, ...newData };
        // @ts-ignore - Ignorar erro de tipo no mutate temporariamente
        mutate(updatedProfile, false);
      }
      
      // Enviar ao servidor
      const response = await api.put(`/companies/${companyId}/tax-profile`, newData);
      
      // Atualizar com os dados reais retornados
      mutate(response.data);
      
      toast.success('Perfil fiscal atualizado com sucesso');
    } catch (err) {
      console.error('Erro ao atualizar perfil fiscal:', err);
      toast.error('Erro ao atualizar perfil fiscal');
      
      // Reverter em caso de erro
      mutate();
    }
  };

  const value = {
    taxProfile: profileToUse,
    isLoading: !error && !data && !usingMockData,
    error,
    updateTaxProfile,
    isTaxProfileComplete
  };

  return (
    <TaxProfileContext.Provider value={value}>
      {children}
    </TaxProfileContext.Provider>
  );
}

export default TaxProfileContext; 