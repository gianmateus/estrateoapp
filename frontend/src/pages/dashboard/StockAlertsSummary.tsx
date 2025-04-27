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
  Button,
  LinearProgress,
  Stack,
  Alert
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  Info as InfoIcon,
  ArrowForward as ArrowIcon,
  Warning as WarningIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface StockAlertsSummaryProps {
  isLoading: boolean;
  totalItens: number;
  itensCriticos: number;
}

const StockAlertsSummary: React.FC<StockAlertsSummaryProps> = ({
  isLoading,
  totalItens,
  itensCriticos
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleNavigateToInventory = () => {
    navigate('/dashboard/inventario');
  };
  
  const handleGenerateReport = () => {
    navigate('/dashboard/inventario?report=true');
  };
  
  // Calcular porcentagem de itens críticos
  const percentualCritico = totalItens > 0 ? Math.round((itensCriticos / totalItens) * 100) : 0;
  
  // Determinar nível de alerta
  const getAlertLevel = (): 'success' | 'warning' | 'error' => {
    if (percentualCritico <= 5) return 'success';
    if (percentualCritico <= 15) return 'warning';
    return 'error';
  };
  
  const alertLevel = getAlertLevel();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderTop: '4px solid',
        borderColor: 'error.main' 
      }}
      elevation={2}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InventoryIcon sx={{ mr: 1, color: 'error.main' }} />
            <Typography variant="h6" component="div">
              {t('controleEstoque')}
            </Typography>
          </Box>
        }
        action={
          <Tooltip title={t('controleEstoqueInfo')}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {isLoading ? (
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={60} />
            <Skeleton variant="rectangular" height={40} />
            <Skeleton variant="rectangular" height={80} />
          </Stack>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('totalItensEstoque')}
                </Typography>
                <Typography variant="h5">
                  {totalItens}
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('itensCriticos')}
                </Typography>
                <Typography variant="h5" color={alertLevel === 'success' ? 'success.main' : `${alertLevel}.main`}>
                  {itensCriticos}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('statusEstoque')}
                </Typography>
                <Typography variant="caption" color={`${alertLevel}.main`} fontWeight="bold">
                  {percentualCritico}% {t('critico')}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate"
                value={percentualCritico}
                color={alertLevel}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
            
            {itensCriticos > 0 ? (
              <Alert 
                severity={alertLevel === 'success' ? 'info' : alertLevel} 
                icon={<WarningIcon />}
                sx={{ mb: 2 }}
              >
                {t('alertaItensBaixoEstoque', { count: itensCriticos })}
              </Alert>
            ) : (
              <Alert 
                severity="success" 
                sx={{ mb: 2 }}
              >
                {t('estoqueEmDia')}
              </Alert>
            )}
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ChartIcon />}
              onClick={handleGenerateReport}
              size="small"
              fullWidth
              sx={{ mb: 1 }}
            >
              {t('gerarRelatorioEstoque')}
            </Button>
          </>
        )}
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
        <Button 
          variant="text" 
          color="error" 
          fullWidth 
          onClick={handleNavigateToInventory}
          endIcon={<ArrowIcon />}
          size="small"
        >
          {t('gerenciarEstoque')}
        </Button>
      </Box>
    </Card>
  );
};

export default StockAlertsSummary; 