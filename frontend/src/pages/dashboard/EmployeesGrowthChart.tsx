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
  TrendingUp as ChartIcon,
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
import { formatNumber } from '../../utils/formatters';

interface EmployeeData {
  mes: string;
  quantidade: number;
}

interface EmployeesGrowthChartProps {
  isLoading: boolean;
  data: EmployeeData[];
}

const EmployeesGrowthChart: React.FC<EmployeesGrowthChartProps> = ({
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box 
              component="span" 
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: theme.palette.info.main,
                display: 'inline-block',
                mr: 1
              }} 
            />
            <Typography variant="body2" color="text.secondary" component="span">
              {t('funcionarios')}:
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ ml: 1 }}>
              {formatNumber(payload[0].value)}
            </Typography>
          </Box>
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
        borderColor: 'info.light'
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChartIcon sx={{ mr: 1, color: 'info.light' }} />
            <Typography variant="h6" component="div">
              {t('crescimentoFuncionarios')}
            </Typography>
          </Box>
        }
        action={
          <Tooltip title={t('crescimentoFuncionariosInfo')}>
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
                dataKey="mes" 
                tick={{ fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <YAxis 
                tick={{ fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="quantidade" 
                name="Funcionários"
                stroke={theme.palette.info.main}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeesGrowthChart; 