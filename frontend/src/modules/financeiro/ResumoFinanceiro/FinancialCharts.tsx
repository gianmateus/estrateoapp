/**
 * Componente FinancialCharts - Gráficos Financeiros
 * 
 * Exibe três gráficos:
 * - Gráfico de linha com variação diária do saldo
 * - Gráfico de pizza para Entradas por Categoria
 * - Gráfico de pizza para Saídas por Categoria
 */

import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  useTheme, 
  Box 
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Importação do Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Registrando os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Interface para dados do gráfico de linha (saldo diário)
interface DailyBalanceData {
  date: string;
  balance: number;
}

// Interface para dados do gráfico de pizza (categorias)
interface CategoryData {
  categoria: string;
  valor: number;
}

interface FinancialChartsProps {
  saldoDiario: DailyBalanceData[];
  entradasPorCategoria: CategoryData[];
  saidasPorCategoria: CategoryData[];
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({
  saldoDiario,
  entradasPorCategoria,
  saidasPorCategoria
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const locale = i18n.language;
  
  // Formatador de moeda conforme o idioma
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };

  // Configurações e dados para o gráfico de linha (saldo diário)
  const lineChartData = {
    labels: saldoDiario.map(item => item.date),
    datasets: [
      {
        label: t('resumoFinanceiro.variacaoSaldoDiario'),
        data: saldoDiario.map(item => item.balance),
        fill: 'start',
        backgroundColor: theme.palette.primary.main + '20',
        borderColor: theme.palette.primary.main,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: theme.palette.primary.main,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  // Cores para os gráficos de pizza
  const incomePieColors = [
    '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#43A047', '#66BB6A', '#2E7D32'
  ];
  
  const expensePieColors = [
    '#F44336', '#E57373', '#EF5350', '#FF8A80', '#D32F2F', '#C62828', '#B71C1C'
  ];

  // Dados para o gráfico de pizza de entradas
  const incomePieData = {
    labels: entradasPorCategoria.map(item => item.categoria),
    datasets: [
      {
        data: entradasPorCategoria.map(item => item.valor),
        backgroundColor: incomePieColors,
        borderWidth: 1,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  // Dados para o gráfico de pizza de saídas
  const expensePieData = {
    labels: saidasPorCategoria.map(item => item.categoria),
    datasets: [
      {
        data: saidasPorCategoria.map(item => item.valor),
        backgroundColor: expensePieColors,
        borderWidth: 1,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = formatCurrency(context.raw);
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  return (
    <Grid container spacing={3}>
      {/* Gráfico de linha - Variação do saldo diário */}
      <Grid item xs={12}>
        <Card sx={{ boxShadow: theme.shadows[3], borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {t('resumoFinanceiro.variacaoSaldoDiario')}
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Gráficos de pizza - Entradas e Saídas por categoria */}
      <Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: theme.shadows[3], height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.success.main }}>
              {t('resumoFinanceiro.entradasPorCategoria')}
            </Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <Pie data={incomePieData} options={pieChartOptions} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: theme.shadows[3], height: '100%', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.error.main }}>
              {t('resumoFinanceiro.saidasPorCategoria')}
            </Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <Pie data={expensePieData} options={pieChartOptions} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FinancialCharts; 