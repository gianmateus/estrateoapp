/// <reference path="../types/swr.d.ts" />
import React, { createContext, useContext, useCallback, useState, ReactNode, useMemo } from 'react';
import { differenceInDays, isAfter, isBefore, parseISO, format, addDays } from 'date-fns';
import useSWR from 'swr';
import api from '../services/api';
import { TaxForecastData, TaxLedgerEntry, TaxType, TaxStatus, TaxSummary } from '../types/tax';

/**
 * TaxContext - Contexto para gerenciamento de dados fiscais
 * 
 * Fornece acesso aos dados de impostos, previsões e operações relacionadas
 * Implementa cache e atualização em tempo real usando SWR
 */

// Endpoints da API (ajustar conforme necessário)
const API_ENDPOINTS = {
  forecast: (period: string) => `/api/tax/forecast/${period}`,
  vatBalance: (period: string) => `/api/tax/vat/balance/${period}`,
  payments: (period: string) => `/api/tax/payments/${period}`,
  submit: (taxId: string) => `/api/tax/submit/${taxId}`
};

// Interface para o contexto de impostos
interface TaxContextData {
  // Dados
  taxForecast: TaxForecastData | null;
  taxSummary: TaxSummary | null;
  taxDetails: Record<TaxType, TaxLedgerEntry[]>;
  vatBalance: number | null;
  
  // Estado
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: Error | null;
  currentPeriod: string;
  
  // Funções
  fetchForecast: (period: string) => Promise<void>;
  fetchTaxSummary: (period?: string) => Promise<void>;
  fetchTaxDetails: (taxType: TaxType, period?: string) => Promise<void>;
  updateCurrentPeriod: (period: string) => void;
  submitTaxPayment: (taxId: string, amount: number) => Promise<void>;
  getTaxStatus: (dueDate: Date | string) => TaxStatus;
}

// Criação do contexto
export const TaxContext = createContext<TaxContextData>({} as TaxContextData);

// Props do provider
interface TaxProviderProps {
  children: ReactNode;
  initialPeriod?: string; // formato 'YYYY-MM'
}

// Provider de impostos
export const TaxProvider: React.FC<TaxProviderProps> = ({ 
  children, 
  initialPeriod 
}) => {
  // Estados
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null);
  const [taxDetails, setTaxDetails] = useState<Record<TaxType, TaxLedgerEntry[]>>({} as Record<TaxType, TaxLedgerEntry[]>);
  const [currentPeriod, setCurrentPeriod] = useState(() => {
    // Usar período inicial fornecido ou calcular o mês atual
    if (initialPeriod) return initialPeriod;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    return `${year}-${month}`;
  });
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  
  // Simulações de dados para desenvolvimento
  const mockTaxData = useCallback(async (period: string): Promise<TaxForecastData> => {
    // Simular um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Gerar dados simulados baseados no período
    const [year, month] = period.split('-');
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 
      'Maio', 'Junho', 'Julho', 'Agosto', 
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const monthIndex = parseInt(month) - 1;
    const monthName = monthNames[monthIndex];
    
    // Valores simulados baseados no mês
    const baseValue = (parseInt(month) * 1000) + (parseInt(year) % 100 * 100);
    
    return {
      mes: `${monthName} ${year}`,
      vatPayable: baseValue * 0.19,
      vatInput: baseValue * 0.11,
      vatOutput: baseValue * 0.3,
      tradeTax: baseValue * 0.15,
      corpTax: baseValue * 0.25,
      payrollTax: baseValue * 0.22,
      soliTax: baseValue * 0.01375 // 5.5% do imposto corporativo
    };
  }, []);
  
  // Fetch de dados com SWR
  const { 
    data: taxForecast, 
    error: forecastError, 
    isValidating: isLoadingForecast,
    mutate: mutateForecast
  } = useSWR<TaxForecastData, Error>(
    API_ENDPOINTS.forecast(currentPeriod),
    // Usar dados mock para desenvolvimento
    () => mockTaxData(currentPeriod),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000 // 1 minuto
    }
  );
  
  // Calcular o saldo de VAT (Output - Input)
  const vatBalance = useMemo(() => {
    if (!taxForecast) return null;
    
    const output = taxForecast.vatOutput || taxForecast.vatPayable || 0;
    const input = taxForecast.vatInput || 0;
    
    return output - input;
  }, [taxForecast]);
  
  // Função para atualizar o período atual
  const updateCurrentPeriod = useCallback((period: string) => {
    setCurrentPeriod(period);
  }, []);
  
  // Função para buscar previsão de impostos
  const fetchForecast = useCallback(async (period: string) => {
    setCurrentPeriod(period);
    await mutateForecast();
  }, [mutateForecast]);
  
  // Função para enviar pagamento de imposto
  const submitTaxPayment = useCallback(async (taxId: string, amount: number) => {
    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log(`Pagamento enviado: ${taxId}, valor: ${amount}`);
      
      // Revalidar dados após pagamento
      await mutateForecast();
      
      return Promise.resolve();
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      }
      return Promise.reject(new Error('Erro desconhecido ao enviar pagamento'));
    }
  }, [mutateForecast]);
  
  // Função para determinar o status do imposto
  const getTaxStatus = useCallback((dueDate: Date | string): TaxStatus => {
    if (!dueDate) return TaxStatus.UPCOMING;
    
    const now = new Date();
    const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    
    // Se a data informada não for válida, retornar UPCOMING
    if (isNaN(due.getTime())) return TaxStatus.UPCOMING;
    
    // Verificar se já foi pago (simulação)
    const isPaid = Math.random() > 0.75; // 25% de chance de estar pago
    if (isPaid) return TaxStatus.PAID;
    
    // Verificar se está atrasado
    if (isBefore(due, now)) {
      return TaxStatus.OVERDUE;
    }
    
    // Verificar se está perto do vencimento (7 dias)
    const daysUntilDue = differenceInDays(due, now);
    if (daysUntilDue <= 7) {
      return TaxStatus.DUE;
    }
    
    // Caso contrário, é um pagamento futuro
    return TaxStatus.UPCOMING;
  }, []);
  
  // Buscar resumo de impostos
  const fetchTaxSummary = async (period?: string) => {
    try {
      setIsLoadingDetails(true);
      const targetPeriod = period || currentPeriod;
      
      // Simular uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados simulados
      const mockSummary: TaxSummary = {
        period: targetPeriod,
        [TaxType.VAT_OUTPUT]: 2500,
        [TaxType.VAT_INPUT]: 1200,
        [TaxType.CIT_PREPAY]: 1800,
        [TaxType.TRADE_PREPAY]: 950,
        [TaxType.LOHNSTEUER]: 3200
      };
      
      setTaxSummary(mockSummary);
    } catch (error) {
      console.error("Erro ao buscar resumo fiscal:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };
  
  // Buscar detalhes por tipo de imposto
  const fetchTaxDetails = async (taxType: TaxType, period?: string) => {
    try {
      setIsLoadingDetails(true);
      const targetPeriod = period || currentPeriod;
      
      // Simular uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Gerar dados simulados baseados no tipo de imposto
      const mockEntries: TaxLedgerEntry[] = Array.from({ length: 3 }, (_, i) => ({
        id: `${taxType}-${i}-${Date.now()}`,
        companyId: '1',
        period: targetPeriod,
        taxType,
        amount: 1000 * (i + 1) * Math.random(),
        currency: 'EUR',
        updatedAt: new Date().toISOString(),
        dueDate: addDays(new Date(), 10 + i * 5).toISOString(),
        isPaid: i === 0
      }));
      
      setTaxDetails(prev => ({
        ...prev,
        [taxType]: mockEntries
      }));
    } catch (error) {
      console.error(`Erro ao buscar detalhes de ${taxType}:`, error);
    } finally {
      setIsLoadingDetails(false);
    }
  };
  
  // Estado consolidado de carregamento
  const isLoading = isLoadingForecast;
  
  // Estado consolidado de erro
  const error = forecastError || null;
  
  return (
    <TaxContext.Provider
      value={{
        // Dados
        taxForecast: taxForecast || null,
        taxSummary,
        taxDetails,
        vatBalance,
        
        // Estado
        isLoading,
        isLoadingDetails,
        error,
        currentPeriod,
        
        // Funções
        fetchForecast,
        fetchTaxSummary,
        fetchTaxDetails,
        updateCurrentPeriod,
        submitTaxPayment,
        getTaxStatus
      }}
    >
      {children}
    </TaxContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useTax = () => useContext(TaxContext); 