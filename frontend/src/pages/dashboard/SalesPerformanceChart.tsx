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
  useTheme,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { 
  ShowChart as ChartIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Tipos para os dados do gráfico
interface SalesData {
  period: string;
  vendas: number;
  meta: number;
}

interface SalesPerformanceChartProps {
  isLoading: boolean;
  data: SalesData[];
}

const SalesPerformanceChart: React.FC<SalesPerformanceChartProps> = ({
  isLoading,
  data
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [timeRange, setTimeRange] = React.useState('3m');

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
          {payload.map((entry: any, index: number) => (
            <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: entry.color, 
                  mr: 1, 
                  borderRadius: '50%' 
                }} 
              />
              <Typography variant="body2" color="text.secondary">
                {entry.name === 'vendas' ? t('vendas') : t('meta')}:
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ ml: 1 }}>
                R$ {entry.value.toLocaleString('pt-BR')}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        borderTop: '4px solid',
        borderColor: 'primary.main'
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChartIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              {t('desempenhoVendas')}
            </Typography>
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl size="small" sx={{ mr: 1, minWidth: 80 }}>
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
                sx={{ height: 32 }}
              >
                <MenuItem value="1m">{t('1mes')}</MenuItem>
                <MenuItem value="3m">{t('3meses')}</MenuItem>
                <MenuItem value="6m">{t('6meses')}</MenuItem>
                <MenuItem value="1y">{t('1ano')}</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title={t('desempenhoVendasInfo')}>
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={250} />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="period" 
                tick={{ fill: theme.palette.text.secondary }} 
                axisLine={{ stroke: theme.palette.divider }}
              />
              <YAxis 
                tick={{ fill: theme.palette.text.secondary }} 
                axisLine={{ stroke: theme.palette.divider }}
                tickFormatter={(value) => `R$ ${value / 1000}k`}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => value === 'vendas' ? t('vendas') : t('meta')} />
              <Line
                type="monotone"
                dataKey="vendas"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke={theme.palette.secondary.main} 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesPerformanceChart; 