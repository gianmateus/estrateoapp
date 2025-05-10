import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider, 
  Skeleton,
  Grid, 
  CardHeader,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Payments as PaymentsIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/formatters';

interface PayrollSummaryCardProps {
  isLoading: boolean;
  valorPago: number;
  valorPendente: number;
}

const PayrollSummaryCard: React.FC<PayrollSummaryCardProps> = ({
  isLoading,
  valorPago,
  valorPendente
}) => {
  const { t } = useTranslation();
  
  const totalSalarios = valorPago + valorPendente;
  const percentualPago = totalSalarios === 0 ? 0 : Math.round((valorPago / totalSalarios) * 100);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderTop: '4px solid',
        borderColor: 'secondary.main' 
      }}
      elevation={2}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentsIcon sx={{ mr: 1, color: 'secondary.main' }} />
            <Typography variant="h6" component="div">
              {t('folhaPagamento')}
            </Typography>
          </Box>
        }
        action={
          <Tooltip title={t('folhaPagamentoInfo')}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        {isLoading ? (
          <Box sx={{ width: '100%' }}>
            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={10} width="70%" sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Skeleton variant="rectangular" height={60} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton variant="rectangular" height={60} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t('progressoPagamento')}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" component="div" sx={{ mr: 1 }}>
                  {percentualPago}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('completado')}
                </Typography>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={percentualPago} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
                color="secondary"
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1, 
                    backgroundColor: 'success.light',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                    <CheckIcon color="success" />
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('valorPago')}
                  </Typography>
                  <Typography variant="h6" color="success.dark" fontWeight="bold">
                    {formatCurrency(valorPago)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1, 
                    backgroundColor: valorPendente > 0 ? 'warning.light' : 'grey.100',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                    <ScheduleIcon color={valorPendente > 0 ? 'warning' : 'disabled'} />
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('valorPendente')}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color={valorPendente > 0 ? 'warning.dark' : 'text.disabled'} 
                    fontWeight="bold"
                  >
                    {formatCurrency(valorPendente)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PayrollSummaryCard; 