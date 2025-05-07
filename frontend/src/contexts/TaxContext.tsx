/// <reference path="../types/swr.d.ts" />
import React, { createContext, useContext, ReactNode } from 'react';
import useSWR from 'swr';
import api from '../services/api';

export interface TaxForecastData {
  mes: string;
  vatPayable: number;
  tradeTax: number;
  corpTax: number;
  payrollTax: number;
}

interface TaxContextType {
  taxForecast: TaxForecastData | null;
  isLoading: boolean;
  error: any;
  fetchForecast: (mes: string) => void;
  mutate: () => Promise<TaxForecastData | undefined>;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

export const TaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data, error, isLoading, mutate } = useSWR<TaxForecastData>(
    () => {
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      return `/api/taxes/forecast?mes=${currentMonth}`;
    },
    async (url: string) => {
      const response = await api.get(url);
      return response.data;
    }
  );

  const fetchForecast = async (mes: string) => {
    try {
      await mutate(async () => {
        const response = await api.get(`/api/taxes/forecast?mes=${mes}`);
        return response.data;
      }, false);
    } catch (error) {
      console.error("Erro ao buscar previsão fiscal:", error);
    }
  };

  return (
    <TaxContext.Provider
      value={{
        taxForecast: data || null,
        isLoading,
        error,
        fetchForecast,
        mutate
      }}
    >
      {children}
    </TaxContext.Provider>
  );
};

export const useTax = () => {
  const context = useContext(TaxContext);
  if (context === undefined) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
}; 