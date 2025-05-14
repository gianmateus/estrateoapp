import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useFormatters from '../../hooks/useFormatters';

/**
 * Componente de exemplo que demonstra a formatação de moeda, data e números
 * de acordo com o idioma atual, sempre exibindo a moeda em euro (€).
 */
const CurrencyFormatExample: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { formatCurrency, formatNumber, formatDate, getCurrentLocale } = useFormatters();
  
  // Dados de exemplo
  const exampleValue = 1200.50;
  const exampleLargeNumber = 1234567.89;
  const exampleDate = new Date();
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('exemplos.formatacao')}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('exemplos.descricao')}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {t('exemplos.idiomaAtual')}: {getCurrentLocale()}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Exemplo de formatação de moeda */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {t('exemplos.moeda')}:
          </Typography>
          <Typography variant="body1">
            {formatCurrency(exampleValue)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('exemplos.valorOriginal')}: {exampleValue}
          </Typography>
        </Box>
        
        {/* Exemplo de formatação de número */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {t('exemplos.numero')}:
          </Typography>
          <Typography variant="body1">
            {formatNumber(exampleLargeNumber)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('exemplos.valorOriginal')}: {exampleLargeNumber}
          </Typography>
        </Box>
        
        {/* Exemplo de formatação de data */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {t('exemplos.data')}:
          </Typography>
          <Typography variant="body1">
            {formatDate(exampleDate)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('exemplos.valorOriginal')}: {exampleDate.toISOString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default CurrencyFormatExample; 