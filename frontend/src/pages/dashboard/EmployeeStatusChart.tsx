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
  PeopleAlt as PeopleIcon,
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

// Tipos para os dados do gráfico
interface EmployeeStatus {
  name: string;
  value: number;
  color: string;
}

interface EmployeeStatusChartProps {
  isLoading: boolean;
  data: EmployeeStatus[];
}

const EmployeeStatusChart: React.FC<EmployeeStatusChartProps> = ({
  isLoading,
  data
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Renderizador customizado para o tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const status = payload[0].payload;
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
          <Typography variant="subtitle2" gutterBottom sx={{ color: status.color }}>
            {status.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {t('quantidade')}:
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ ml: 1 }}>
              {status.value}
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  // Renderizador customizado para as labels do gráfico
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Total de funcionários
  const totalEmployees = data.reduce((sum, item) => sum + item.value, 0);

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
            <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              {t('statusFuncionarios')}
            </Typography>
          </Box>
        }
        action={
          <Tooltip title={t('statusFuncionariosInfo')}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {t('totalFuncionarios')}: {totalEmployees}
          </Typography>
        }
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {isLoading ? (
          <Skeleton variant="circular" width="100%" height={200} />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value) => <span style={{ color: theme.palette.text.primary }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeStatusChart; 