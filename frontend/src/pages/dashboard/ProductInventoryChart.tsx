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
  Badge,
  Chip
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';

// Tipos para os dados do gráfico
interface ProductInventory {
  name: string;
  quantidade: number;
  minimo: number;
}

interface ProductInventoryChartProps {
  isLoading: boolean;
  data: ProductInventory[];
}

const ProductInventoryChart: React.FC<ProductInventoryChartProps> = ({
  isLoading,
  data
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Função para determinar a cor da barra baseada no nível de estoque
  const getBarColor = (produto: ProductInventory) => {
    if (produto.quantidade <= produto.minimo * 0.5) {
      return theme.palette.error.main; // Crítico
    } else if (produto.quantidade <= produto.minimo) {
      return theme.palette.warning.main; // Baixo
    }
    return theme.palette.success.main; // Adequado
  };

  // Contagem de produtos com estoque baixo
  const lowStockCount = data?.filter(item => item.quantidade <= item.minimo).length || 0;

  // Função para customizar o tooltip do gráfico
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const produto = payload[0].payload;
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
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {t('estoqueAtual')}:
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ ml: 1 }}>
              {produto.quantidade} {t('unidades')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {t('estoqueMinimo')}:
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ ml: 1 }}>
              {produto.minimo} {t('unidades')}
            </Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Chip 
              size="small"
              label={
                produto.quantidade <= produto.minimo * 0.5 
                  ? t('estoqueCritico') 
                  : produto.quantidade <= produto.minimo 
                    ? t('estoqueBaixo') 
                    : t('estoqueAdequado')
              }
              color={
                produto.quantidade <= produto.minimo * 0.5 
                  ? 'error' 
                  : produto.quantidade <= produto.minimo 
                    ? 'warning' 
                    : 'success'
              }
            />
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
        borderColor: 'primary.main'
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              {t('situacaoEstoque')}
            </Typography>
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {lowStockCount > 0 && (
              <Tooltip title={t('produtosEstoqueBaixo', { count: lowStockCount })}>
                <Badge badgeContent={lowStockCount} color="error" sx={{ mr: 1 }}>
                  <WarningIcon color="warning" />
                </Badge>
              </Tooltip>
            )}
            <Tooltip title={t('situacaoEstoqueInfo')}>
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
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 70,
              }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: theme.palette.text.secondary }} 
                axisLine={{ stroke: theme.palette.divider }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                tick={{ fill: theme.palette.text.secondary }} 
                axisLine={{ stroke: theme.palette.divider }}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Bar dataKey="quantidade" name={String(t('quantidade'))}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductInventoryChart; 