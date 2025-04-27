import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Skeleton,
  CardHeader,
  Tooltip,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  BarChart as ChartIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface ChartData {
  mes: string;
  receitas: number;
  despesas: number;
}

interface RevenueVsExpensesChartProps {
  isLoading: boolean;
  data: ChartData[];
}

const RevenueVsExpensesChart: React.FC<RevenueVsExpensesChartProps> = ({
  isLoading,
  data
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Função para customizar o tooltip do gráfico
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box 
          sx={{ 
            backgroundColor: 'background.paper', 
            p: 1.5, 
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry: any) => (
            <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box 
                component="span" 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: entry.color,
                  display: 'inline-block',
                  mr: 1
                }} 
              />
              <Typography variant="body2" color="text.secondary" component="span">
                {entry.name === 'receitas' ? t('receitas') : t('despesas')}:
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ ml: 1 }}>
                {formatCurrency(entry.value)}
              </Typography>
            </Box>
          ))}
          {payload.length >= 2 && (
            <Box sx={{ mt: 1, pt: 1, borderTop: `1px dashed ${theme.palette.divider}` }}>
              <Typography variant="body2" color="text.secondary" component="span">
                {t('saldo')}:
              </Typography>
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                sx={{ ml: 1 }}
                color={payload[0].value - payload[1].value >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(payload[0].value - payload[1].value)}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        borderTop: '4px solid',
        borderColor: 'primary.light'
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChartIcon sx={{ mr: 1, color: 'primary.light' }} />
            <Typography variant="h6" component="div">
              {t('graficoReceitasDespesas')}
            </Typography>
          </Box>
        }
        action={
          <Tooltip title={t('graficoReceitasDespesasInfo')}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />
      
      <CardContent sx={{ flexGrow: 1, height: 300, p: theme.spacing(2, 1, 1, 0) }}>
        {isLoading ? (
          <Skeleton variant="rectangular" height="100%" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barGap={0}
              barCategoryGap={20}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="mes" 
                tick={{ fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <YAxis 
                tickFormatter={(value) => `${value / 1000}k`}
                tick={{ fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => t(value)}
                wrapperStyle={{ paddingTop: 20 }}
              />
              <Bar 
                dataKey="receitas" 
                name="receitas" 
                fill={theme.palette.success.main} 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="despesas" 
                name="despesas" 
                fill={theme.palette.error.main} 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueVsExpensesChart; 