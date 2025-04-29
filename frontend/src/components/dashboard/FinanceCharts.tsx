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
  Grid,
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
import { formatCurrency, formatPercentage } from '../../utils/formatters';

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

// Cores para o gráfico de pizza
const COLORS = ['#1a365d', '#4a6fa5', '#ff9800', '#4caf50', '#f44336'];

// Componente de tooltip customizado para o gráfico de barras
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 1,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
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
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = gastosData.reduce((sum, item) => sum + item.value, 0);
    const percentage = data.value / total;
    
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 1,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600 }}>{data.name}</Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption">
            {formatCurrency(data.value)} ({formatPercentage(percentage)})
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

// Renderização personalizada para os labels do gráfico de pizza
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333333"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {gastosData[index].name} ({(percent * 100).toFixed(0)}%)
    </text>
  );
};

const FinanceCharts: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h2" gutterBottom sx={{ mb: 3 }}>
        {t('graficos')}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Gráfico de Barras */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.06)', height: '100%' }}>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                {t('finance.charts.monthlyIncome')}
              </Typography>
              <Box sx={{ height: 300, pt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      tickFormatter={(value) => `€${value / 1000}k`}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: 10 }}
                      formatter={(value) => (
                        <span style={{ color: theme.palette.text.primary, fontSize: 12 }}>
                          {t(value === 'receita' ? 'receitas' : 'despesas')}
                        </span>
                      )}
                    />
                    <Bar 
                      dataKey="receita" 
                      name="receita" 
                      fill={theme.palette.primary.main} 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                    <Bar 
                      dataKey="despesa" 
                      name="despesa" 
                      fill={theme.palette.error.main} 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                      animationBegin={300}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Pizza */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.06)', height: '100%' }}>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                {t('relatorioGastos')}
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
                      label={renderCustomizedLabel}
                      animationDuration={1500}
                      animationBegin={300}
                    >
                      {gastosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Linha */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.06)', height: '100%' }}>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                {t('historicoContratacoes')}
              </Typography>
              <Box sx={{ height: 300, pt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={funcionariosData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 4,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}
                      formatter={(value: number) => [value, t('totalFuncionarios')]}
                      labelFormatter={(label) => label}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: 10 }}
                      formatter={(value) => (
                        <span style={{ color: theme.palette.text.primary, fontSize: 12 }}>
                          {t('totalFuncionarios')}
                        </span>
                      )}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ativos" 
                      name="ativos"
                      stroke={theme.palette.primary.main} 
                      strokeWidth={2}
                      dot={{ r: 4, fill: theme.palette.primary.main, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: theme.palette.primary.main, stroke: theme.palette.background.paper, strokeWidth: 2 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinanceCharts; 