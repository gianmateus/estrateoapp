import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider, 
  Skeleton,
  Stack, 
  CardHeader,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  AccountBalance as BalanceIcon,
  Payments as PaymentsIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/formatters';

interface FinancialSummaryCardProps {
  isLoading: boolean;
  saldoAtual: number;
  proximasContas: {
    quantidade: number;
    valorTotal: number;
  };
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  isLoading,
  saldoAtual,
  proximasContas
}) => {
  const { t } = useTranslation();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderTop: '4px solid',
        borderColor: 'primary.main' 
      }}
      elevation={2}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div">
              {t('resumoFinanceiro')}
            </Typography>
          </Box>
        }
        action={
          <Tooltip title={t('saldoFinanceiroInfo')}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('saldoFinanceiroAtual')}
          </Typography>
          
          {isLoading ? (
            <Skeleton variant="rectangular" height={40} />
          ) : (
            <Typography variant="h4" color={saldoAtual >= 0 ? 'success.main' : 'error.main'}>
              {formatCurrency(saldoAtual)}
            </Typography>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('proximasContas')}
          </Typography>
          
          {isLoading ? (
            <Stack spacing={1}>
              <Skeleton variant="rectangular" height={30} />
              <Skeleton variant="rectangular" height={30} />
            </Stack>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PaymentsIcon sx={{ mr: 1, fontSize: '1rem', color: 'warning.main' }} />
                  <Typography variant="body2">
                    {t('contasVencer')}
                  </Typography>
                </Box>
                <Chip 
                  label={proximasContas.quantidade} 
                  color="warning" 
                  size="small" 
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                  {t('valorTotalContas')}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="warning.main">
                  {formatCurrency(proximasContas.valorTotal)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryCard; 