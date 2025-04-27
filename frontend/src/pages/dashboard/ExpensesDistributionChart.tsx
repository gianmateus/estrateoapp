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
  PieChart as ChartIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip as ChartTooltip
} from 'recharts';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface ExpenseData {
  categoria: string;
  valor: number;
  percentual: number;
}

interface ExpensesDistributionChartProps {
  isLoading: boolean;
  data: ExpenseData[];
}

const ExpensesDistributionChart: React.FC<ExpensesDistributionChartProps> = ({
  isLoading,
  data
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Cores para as diferentes categorias
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    // Adicionando variações de cores para categorias adicionais
    theme.palette.primary.light,
    theme.palette.secondary.light,
    theme.palette.success.light
  ];
  
  // Função para customizar o tooltip do gráfico
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            {data.categoria}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary" component="span">
              {t('valor')}:
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ ml: 2 }}>
              {formatCurrency(data.valor)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary" component="span">
              {t('percentual')}:
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ ml: 2 }}>
              {formatPercentage(data.percentual / 100)}
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  // Renderização do label no gráfico de pizza
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    // Apenas mostrar o percentual para fatias maiores que 5%
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        borderTop: '4px solid',
        borderColor: 'secondary.light'
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChartIcon sx={{ mr: 1, color: 'secondary.light' }} />
            <Typography variant="h6" component="div">
              {t('distribuicaoDespesas')}
            </Typography>
          </Box>
        }
        action={
          <Tooltip title={t('distribuicaoDespesasInfo')}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />
      
      <CardContent sx={{ flexGrow: 1, height: 300, p: theme.spacing(2) }}>
        {isLoading ? (
          <Skeleton variant="rectangular" height="100%" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
                nameKey="categoria"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value, entry) => t(value.toLowerCase().replace(/\s+/g, ''))}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesDistributionChart; 