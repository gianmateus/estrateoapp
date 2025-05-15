/**
 * Componente FinancialCharts - Gráficos financeiros do dashboard
 * Component FinancialCharts - Dashboard financial charts
 * 
 * Exibe gráficos de barras e de pizza com dados financeiros
 * Displays bar and pie charts with financial data
 */

import React from 'react';
import { Grid, Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface ChartDataItem {
  date: string;
  income: number;
  expenses: number;
}

interface ExpenseCategoryItem {
  categoria: string;
  valorSaidas: number;
  color?: string;
}

interface FinancialChartsProps {
  barChartData: ChartDataItem[];
  expenseCategories: ExpenseCategoryItem[];
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({
  barChartData,
  expenseCategories
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Cores padrão para o gráfico de pizza
  // Default colors for pie chart
  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    '#9c27b0', // purple
    '#795548', // brown
    '#607d8b', // blue-grey
    '#009688', // teal
  ];
  
  // Preparar dados para o gráfico de pizza com cores
  // Prepare data for the pie chart with colors
  const pieData = expenseCategories.map((item, index) => ({
    name: item.categoria,
    value: item.valorSaidas,
    color: item.color || defaultColors[index % defaultColors.length]
  }));

  return (
    <Grid container spacing={4}>
      {/* Gráfico de Barras - Receitas vs Despesas */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: theme.shadows[3],
            p: 3,
            height: '100%'
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 500 }}
          >
            {t('finance_charts_monthlyIncome') || t('movimentacoes_financeiras')}
          </Typography>
          
          <Box
            sx={{ height: 300 }}
            aria-labelledby="receitas-despesas-chart-title"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${value}€`} />
                <ChartTooltip 
                  labelStyle={{ color: theme.palette.text.secondary }}
                  itemStyle={{
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2
                  }}
                  formatter={(value: number) => [formatCurrency(Number(value)), '']}
                />
                <Legend />
                <Bar
                  name={String(t('receitas'))}
                  dataKey="income"
                  fill={theme.palette.success.main}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  name={String(t('despesas'))}
                  dataKey="expenses"
                  fill={theme.palette.error.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>
      
      {/* Gráfico de Pizza - Categorias de Gastos */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: theme.shadows[3],
            p: 3,
            height: '100%'
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 500 }}
          >
            {t('relatorioGastos')}
          </Typography>
          
          <Box
            sx={{ height: 300 }}
            aria-labelledby="gastos-chart-title"
          >
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      name
                    }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
                      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill={theme.palette.text.primary}
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {name} ({`${(percent * 100).toFixed(0)}%`})
                        </text>
                      );
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    formatter={(value) => [formatCurrency(Number(value)), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>{t('semDadosNoPeriodo')}</Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FinancialCharts; 