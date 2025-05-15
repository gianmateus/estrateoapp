/**
 * Componente principal ResumoFinanceiro - Unifica todos os componentes em um layout organizado
 * 
 * Este componente integra todas as seções do Resumo Financeiro:
 * 1. KPIs principais (quatro cards na linha superior)
 * 2. Gráficos financeiros (gráfico de linha e dois de pizza)
 * 3. Comparação com mês anterior (tabela comparativa)
 */

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider,
  Grid,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Importação dos componentes
import KPICards from './KPICards';
import FinancialCharts from './FinancialCharts';
import MonthComparison from './MonthComparison';

// Dados mockados para demonstração (seriam substituídos por chamadas API reais)
const mockData = {
  kpis: {
    saldoAtual: 28465.75,
    totalEntradas: 42980.32,
    totalSaidas: 14514.57
  },
  
  saldoDiario: [
    { date: '01/05', balance: 25400.00 },
    { date: '02/05', balance: 26500.00 },
    { date: '03/05', balance: 26800.00 },
    { date: '04/05', balance: 26200.00 },
    { date: '05/05', balance: 27800.00 },
    { date: '06/05', balance: 27500.00 },
    { date: '07/05', balance: 28465.75 }
  ],
  
  entradasPorCategoria: [
    { categoria: 'Vendas', valor: 31250.80 },
    { categoria: 'Serviços', valor: 7500.00 },
    { categoria: 'Investimentos', valor: 2950.40 },
    { categoria: 'Outras', valor: 1279.12 }
  ],
  
  saidasPorCategoria: [
    { categoria: 'Fornecedores', valor: 5420.32 },
    { categoria: 'Salários', valor: 4800.00 },
    { categoria: 'Aluguel', valor: 2200.00 },
    { categoria: 'Impostos', valor: 1568.45 },
    { categoria: 'Outras', valor: 525.80 }
  ],
  
  comparacaoMensal: {
    entradas: {
      mesAtual: 42980.32,
      mesAnterior: 38450.65
    },
    saidas: {
      mesAtual: 14514.57,
      mesAnterior: 15200.80
    },
    lucro: {
      mesAtual: 28465.75,
      mesAnterior: 23249.85
    }
  }
};

const ResumoFinanceiro: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Cabeçalho */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {t('resumoFinanceiro.titulo')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('resumoFinanceiro.visaoGeralFinancas')}
          </Typography>
        </Box>

        {/* Seção 1: KPI Cards */}
        <Box sx={{ mb: 4 }}>
          <KPICards
            saldoAtual={mockData.kpis.saldoAtual}
            totalEntradas={mockData.kpis.totalEntradas}
            totalSaidas={mockData.kpis.totalSaidas}
          />
        </Box>
        
        <Divider sx={{ my: 4 }} />

        {/* Seção 2: Gráficos Financeiros */}
        <Box sx={{ mb: 4 }}>
          <FinancialCharts
            saldoDiario={mockData.saldoDiario}
            entradasPorCategoria={mockData.entradasPorCategoria}
            saidasPorCategoria={mockData.saidasPorCategoria}
          />
        </Box>
        
        <Divider sx={{ my: 4 }} />

        {/* Seção 3: Comparação Mensal */}
        <Box>
          <MonthComparison 
            dados={mockData.comparacaoMensal} 
          />
        </Box>
      </Box>
    </Container>
  );
};

export default ResumoFinanceiro; 