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
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  Inventory as InventoryIcon,
  Info as InfoIcon,
  ArrowForward as ArrowIcon,
  Warning as WarningIcon,
  BarChart as ChartIcon,
  ErrorOutline as ErrorIcon,
  Timer as TimerIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface StockAlertsSummaryProps {
  isLoading: boolean;
  totalItens: number;
  itensCriticos: number;
  itensProximosVencimento?: number;
  itensVencidos?: number;
  alertasProdutos?: Array<{
    id: string;
    nome: string;
    tipo: 'estoque_baixo' | 'proxim_vencimento' | 'vencido';
    mensagem: string;
  }>;
}

const StockAlertsSummary: React.FC<StockAlertsSummaryProps> = ({
  isLoading,
  totalItens,
  itensCriticos,
  itensProximosVencimento = 0,
  itensVencidos = 0,
  alertasProdutos = []
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
    if (percentualCritico <= 5 && itensVencidos === 0) return 'success';
    if (percentualCritico <= 15 && itensVencidos === 0) return 'warning';
    return 'error';
  };
  
  const alertLevel = getAlertLevel();
  
  // Total de alertas
  const totalAlertas = itensCriticos + itensProximosVencimento + itensVencidos;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderTop: '4px solid',
        borderColor: totalAlertas > 0 ? 'error.main' : 'success.main' 
      }}
      elevation={2}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InventoryIcon sx={{ mr: 1, color: totalAlertas > 0 ? 'error.main' : 'success.main' }} />
            <Typography variant="h6" component="div">
              {t('controleEstoque')}
            </Typography>
            {totalAlertas > 0 && (
              <Chip 
                label={totalAlertas} 
                color="error" 
                size="small" 
                sx={{ ml: 1 }}
              />
            )}
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('statusEstoque')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {itensVencidos > 0 && (
                    <Chip 
                      icon={<ErrorIcon fontSize="small" />} 
                      label={`${itensVencidos} ${t('vencidos')}`} 
                      size="small" 
                      color="error" 
                    />
                  )}
                  {itensProximosVencimento > 0 && (
                    <Chip 
                      icon={<TimerIcon fontSize="small" />} 
                      label={`${itensProximosVencimento} ${t('proximosVencimento')}`} 
                      size="small" 
                      color="warning" 
                    />
                  )}
                </Box>
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
            
            {totalAlertas > 0 ? (
              <>
                <Alert 
                  severity={itensVencidos > 0 ? 'error' : (itensProximosVencimento > 0 ? 'warning' : 'info')} 
                  icon={itensVencidos > 0 ? <ErrorIcon /> : <WarningIcon />}
                  sx={{ mb: 2 }}
                >
                  {itensVencidos > 0 
                    ? t('alertaProdutosVencidos', { count: itensVencidos })
                    : (itensProximosVencimento > 0 
                      ? t('alertaProdutosProximosVencimento', { count: itensProximosVencimento })
                      : t('alertaItensBaixoEstoque', { count: itensCriticos }))
                  }
                </Alert>
                
                {alertasProdutos.length > 0 && (
                  <List dense sx={{ 
                    mb: 2, 
                    maxHeight: 150, 
                    overflow: 'auto',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    {alertasProdutos.slice(0, 3).map((alerta, index) => (
                      <React.Fragment key={alerta.id}>
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {alerta.tipo === 'vencido' && <ErrorIcon color="error" />}
                            {alerta.tipo === 'proxim_vencimento' && <TimerIcon color="warning" />}
                            {alerta.tipo === 'estoque_baixo' && <WarningIcon color="info" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={alerta.nome}
                            secondary={alerta.mensagem}
                            primaryTypographyProps={{ fontWeight: 'medium', fontSize: '0.9rem' }}
                            secondaryTypographyProps={{ fontSize: '0.8rem' }}
                          />
                        </ListItem>
                        {index < alertasProdutos.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                    {alertasProdutos.length > 3 && (
                      <ListItem button onClick={handleNavigateToInventory}>
                        <ListItemText 
                          primary={t('verTodosAlertas', { count: alertasProdutos.length - 3 })}
                          primaryTypographyProps={{ 
                            align: 'center', 
                            color: 'primary', 
                            fontWeight: 'medium', 
                            fontSize: '0.8rem' 
                          }}
                        />
                      </ListItem>
                    )}
                  </List>
                )}
              </>
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
          color={totalAlertas > 0 ? "error" : "primary"} 
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