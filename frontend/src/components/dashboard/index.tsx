/**
 * Componente principal do Dashboard - Unifica todos os componentes em um layout organizado
 * Main Dashboard component - Unifies all components in a structured layout
 * 
 * Este componente integra todas as seções do dashboard:
 * 1. KPIs principais (linha superior com cards)
 * 2. Gráficos financeiros (linha do meio)
 * 3. Parcelamentos e Recebíveis (abaixo dos gráficos)
 * 4. Recomendações da IA (parte final)
 * 
 * This component integrates all dashboard sections:
 * 1. Main KPIs (top row with cards)
 * 2. Financial charts (middle row)
 * 3. Installments and Receivables (below charts)
 * 4. AI Recommendations (bottom section)
 */

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import KPICards from './KPICards';
import FinancialCharts from './FinancialCharts';
import Parcelamentos from './Parcelamentos';
import IARecommendations from './IARecommendations';

// Interface que define os dados necessários para o dashboard
// Interface defining the necessary data for the dashboard
interface DashboardProps {
  dashboardData: {
    resumoFinanceiro: {
      saldoAtual: number;
      totalEntradas: number;
      totalSaidas: number;
    };
    resumoInventario: {
      totalItens: number;
      itensCriticos: number;
    };
    estatisticasUso: {
      usuariosAtivosHoje: number;
      usuariosTotais: number;
    };
    recomendacoesIA: string[];
    recebiveisFuturos: Array<{
      id: string;
      descricao: string;
      valor: number;
      dataPrevista: string;
      statusRecebimento: string;
      cliente: string;
    }>;
    parcelamentosAbertos: Array<{
      id: string;
      descricao: string;
      valor: number;
      parcelasPagas: number;
      totalParcelas: number;
      proximaParcela: {
        valor: number;
        data: string;
      };
      tipo: 'entrada' | 'saida';
    }>;
    totaisPorCategoria: Array<{
      categoria: string;
      valorEntradas: number;
      valorSaidas: number;
      saldo: number;
    }>;
  };
  chartData: Array<{
    date: string;
    income: number;
    expenses: number;
  }>;
  todayIncome: number;
  todayExpenses: number;
  funcionariosEmFerias: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  dashboardData,
  chartData,
  todayIncome,
  todayExpenses,
  funcionariosEmFerias
}) => {
  const { t } = useTranslation();
  
  // Preparar dados de categorias de despesas para o gráfico de pizza
  // Prepare expense category data for pie chart
  const expenseCategories = dashboardData.totaisPorCategoria.map(cat => ({
    categoria: cat.categoria,
    valorSaidas: cat.valorSaidas
  }));

  return (
    <Box sx={{ py: 3 }}>
      {/* Seção 1: KPIs Principais */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {t('visaoGeral')}
      </Typography>
      
      <KPICards 
        currentBalance={dashboardData.resumoFinanceiro.saldoAtual}
        incomeToday={todayIncome}
        expenseToday={todayExpenses}
        stockItems={dashboardData.resumoInventario.totalItens}
        employeesOnVacation={funcionariosEmFerias}
        activeUsers={dashboardData.estatisticasUso.usuariosAtivosHoje}
      />
      
      {/* Seção 2: Gráficos Financeiros */}
      <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 600 }}>
        {t('graficos')}
      </Typography>
      
      <FinancialCharts 
        barChartData={chartData}
        expenseCategories={expenseCategories}
      />
      
      {/* Seção 3: Parcelamentos e Recebíveis */}
      <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 600 }}>
        Parcelamentos e Recebíveis
      </Typography>
      
      <Parcelamentos 
        parcelamentosAbertos={dashboardData.parcelamentosAbertos}
        recebiveisFuturos={dashboardData.recebiveisFuturos}
      />
      
      {/* Seção 4: Recomendações da IA */}
      <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 600 }}>
        {t('recomendacoesIA')}
      </Typography>
      
      <IARecommendations 
        recommendations={dashboardData.recomendacoesIA}
      />
    </Box>
  );
};

export default Dashboard; 