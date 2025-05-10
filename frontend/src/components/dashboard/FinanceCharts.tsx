/**
 * Componente de gráficos financeiros para o Dashboard
 * 
 * Implementa os gráficos solicitados:
 * - Gráfico de barras: Receita vs. Despesa dos últimos 6 meses
 * - Gráfico de pizza: Distribuição percentual de gastos
 * - Gráfico de linha: Evolução de funcionários ativos mês a mês
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { motion } from 'framer-motion';
import ResponsiveGrid from '../common/ResponsiveGrid';
import EmptyState from '../ui/EmptyState';

// Dados de exemplo para os gráficos
// Em produção, estes dados viriam das APIs correspondentes
const monthlyData = [
  { month: 'Jan', receita: 4000, despesa: 2400 },
  { month: 'Fev', receita: 3000, despesa: 1398 },
  { month: 'Mar', receita: 2000, despesa: 9800 },
  { month: 'Abr', receita: 2780, despesa: 3908 },
  { month: 'Mai', receita: 1890, despesa: 4800 },
  { month: 'Jun', receita: 2390, despesa: 3800 },
];

const gastosData = [
  { name: 'Insumos', value: 400 },
  { name: 'Salários', value: 300 },
  { name: 'Aluguel', value: 300 },
  { name: 'Marketing', value: 200 },
  { name: 'Outros', value: 100 },
];

const funcionariosData = [
  { month: 'Jan', ativos: 40 },
  { month: 'Fev', ativos: 42 },
  { month: 'Mar', ativos: 45 },
  { month: 'Abr', ativos: 48 },
  { month: 'Mai', ativos: 52 },
  { month: 'Jun', ativos: 58 },
];

// Componente de tooltip customizado para o gráfico de barras
const CustomBarTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme();
  
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          border: 'none'
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
        <Box sx={{ mt: 1 }}>
          {payload.map((entry: any, index: number) => (
            <Box 
              key={`tooltip-item-${index}`} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 0.5 
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: entry.color,
                  mr: 1
                }}
              />
              <Typography variant="caption" sx={{ mr: 1 }}>
                {entry.name}:
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {formatCurrency(entry.value)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
  return null;
};

// Componente de tooltip customizado para o gráfico de pizza
const CustomPieTooltip = ({ active, payload }: any) => {
  const theme = useTheme();
  
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = gastosData.reduce((sum, item) => sum + item.value, 0);
    const percentage = data.value / total;
    
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          border: 'none'
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600 }}>{data.name}</Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption">
            {formatCurrency(data.value)} ({formatPercent(percentage)})
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

// Variantes para animações
const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
  }
};

export interface ChartDataItem {
  date: string;
  income: number;
  expenses: number;
}

interface FinanceChartsProps {
  chartData: ChartDataItem[];
  formatCurrency: (value: number) => string;
}

const FinanceCharts: React.FC<FinanceChartsProps> = ({ chartData, formatCurrency }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Cores do tema para os gráficos
  const chartColors = {
    receita: theme.palette.primary.main,
    despesa: theme.palette.error.main,
    funcionarios: theme.palette.info.main
  };
  
  // Cores para o gráfico de pizza baseadas na paleta do tema
  const pieColors = [
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main
  ];
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        {t('graficos') || "Gráficos Financeiros"}
      </Typography>
      
      <ResponsiveGrid spacing={4}>
        {/* Gráfico de Barras - Receitas vs. Despesas */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={chartVariants}
        >
          <Card sx={{ boxShadow: theme.shadows[3], borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                {t('graficosFinanceiros')}
              </Typography>
              
              {chartData.length > 0 ? (
                <Box sx={{ height: 350, mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={theme.palette.divider} 
                        opacity={0.3} 
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value}€`}
                        tick={{ fill: theme.palette.text.secondary }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 8,
                          boxShadow: theme.shadows[3],
                          border: `1px solid ${theme.palette.divider}`,
                          color: theme.palette.text.primary,
                          padding: 16
                        }}
                        formatter={(value) => [formatCurrency(Number(value)), '']}
                        labelStyle={{ 
                          color: theme.palette.text.secondary, 
                          fontWeight: 500 
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: 20 }}
                        formatter={(value) => (
                          <span style={{ 
                            color: theme.palette.text.primary, 
                            fontWeight: 500 
                          }}>
                            {value}
                          </span>
                        )}
                      />
                      <Bar
                        name={String(t('receitas'))}
                        dataKey="income"
                        fill={theme.palette.success.main}
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                      <Bar
                        name={String(t('despesas'))}
                        dataKey="expenses"
                        fill={theme.palette.error.main}
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <EmptyState message={t('semDadosNoPeriodo') as string} />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráfico de Pizza - Distribuição de Gastos */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={chartVariants}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                {t('relatorioGastos') || "Distribuição de Gastos"}
              </Typography>
              <Box sx={{ height: 300, pt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <Pie
                      data={gastosData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1500}
                      animationBegin={300}
                    >
                      {gastosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value, entry, index) => (
                        <span style={{ color: theme.palette.text.primary, fontSize: 12 }}>
                          {value} ({formatPercent(gastosData[index].value / gastosData.reduce((sum, item) => sum + item.value, 0))})
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráfico de Linha - Evolução de Funcionários */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={chartVariants}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                {t('evolucaoFuncionarios') || "Evolução de Funcionários"}
              </Typography>
              <Box sx={{ height: 300, pt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={funcionariosData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="rgba(0,0,0,0.05)" 
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} 
                      domain={['dataMin - 5', 'dataMax + 5']}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 8,
                        boxShadow: theme.shadows[3],
                        border: 'none'
                      }}
                      formatter={(value) => [value, 'Funcionários']}
                    />
                    <Line
                      type="monotone"
                      dataKey="ativos"
                      stroke={chartColors.funcionarios}
                      strokeWidth={2}
                      dot={{ fill: chartColors.funcionarios, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: chartColors.funcionarios }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </ResponsiveGrid>
    </Box>
  );
};

export default FinanceCharts; 