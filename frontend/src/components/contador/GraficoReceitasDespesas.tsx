/**
 * Chart component for Revenue vs Expenses used in the Contador (Accountant) module
 * Displays monthly financial data in a bar chart format
 * 
 * Componente de gráfico para Receitas vs Despesas usado no módulo Contador
 * Exibe dados financeiros mensais em formato de gráfico de barras
 */
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { 
  NameType, 
  ValueType 
} from 'recharts/types/component/DefaultTooltipContent';

// Interface for the chart data points
// Interface para os pontos de dados do gráfico
interface DataPoint {
  dia: string;       // Day or date label / Rótulo de dia ou data 
  receitas: number;  // Revenue amount / Valor de receitas
  despesas: number;  // Expenses amount / Valor de despesas
}

interface GraficoReceitasDespesasProps {
  data: DataPoint[];  // Array of data points for the chart / Array de pontos de dados para o gráfico
}

/**
 * Custom tooltip component for the chart
 * Shows formatted currency values
 * 
 * Componente de tooltip personalizado para o gráfico
 * Mostra valores monetários formatados
 */
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    // Format currency values for the tooltip
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    };
    
    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          p: 1.5,
          border: '1px solid #ccc',
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
        <p style={{ margin: '8px 0 0', color: '#4caf50' }}>
          {t('contador.tabelaEntradas')}: {formatCurrency(payload[0].value as number)}
        </p>
        <p style={{ margin: '4px 0 0', color: '#f44336' }}>
          {t('contador.tabelaSaidas')}: {formatCurrency(payload[1].value as number)}
        </p>
      </Box>
    );
  }

  return null;
};

/**
 * Revenue vs Expenses bar chart component
 * 
 * Componente de gráfico de barras de Receitas vs Despesas
 */
const GraficoReceitasDespesas: React.FC<GraficoReceitasDespesasProps> = ({ data }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  return (
    <Box sx={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="dia" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => {
              return value >= 1000 ? `€${value / 1000}k` : `€${value}`;
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="receitas" 
            name={t('contador.tabelaEntradas')} 
            fill="#4caf50" 
            radius={[5, 5, 0, 0]} 
          />
          <Bar 
            dataKey="despesas" 
            name={t('contador.tabelaSaidas')} 
            fill="#f44336" 
            radius={[5, 5, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default GraficoReceitasDespesas; 