/**
 * Contador (Accountant) Module - Main Page
 * 
 * Página principal do módulo financeiro e contábil, adaptada para o mercado alemão e europeu.
 * 
 * Recursos principais:
 * - Cálculos automáticos de impostos alemães (Mehrwertsteuer/VAT, Gewerbesteuer)
 * - Relatórios compatíveis com o sistema ELSTER
 * - Exportação em formato XBRL para conformidade com regulamentação EU
 * - Internacionalização completa (alemão/inglês)
 * - Implementação de conformidade com GDPR
 */
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  SelectChangeEvent,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format, subMonths } from 'date-fns';
import { ptBR, de } from 'date-fns/locale';
import ContadorDashboard from '../modules/contador/ContadorDashboard';

// Import services
import dataService from '../modules/contador/services/dataService';

/**
 * Returns an array of months for dropdown selection
 * 
 * @param count Number of months to generate (default 12)
 * @returns Array of month objects with date and formatted label
 */
const getMonthOptions = (count = 12, currentLocale = ptBR) => {
  const options = [];
  let currentDate = new Date();
  
  for (let i = 0; i < count; i++) {
    const monthDate = subMonths(currentDate, i);
    options.push({
      value: format(monthDate, 'yyyy-MM'),
      label: format(monthDate, 'MMMM yyyy', { locale: currentLocale })
    });
  }
  
  return options;
};

/**
 * Contador (Accountant) page component
 * Displays financial data organized for EU accounting purposes
 */
const Contador: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Forçar o idioma português
  useEffect(() => {
    i18n.changeLanguage('pt');
    localStorage.setItem('appLanguage', 'pt-BR');
  }, [i18n]);
  
  // Definir localidade de datas de acordo com o idioma
  const currentLocale = i18n.language === 'de' ? de : ptBR;
  const monthOptions = getMonthOptions(12, currentLocale);
  
  // Handle month selection change
  const handleMonthChange = (event: SelectChangeEvent) => {
    setSelectedMonth(event.target.value as string);
  };
  
  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };
  
  // Função para garantir que o texto da tradução não seja null
  const getText = (key: string, fallback: string): string => {
    const translated = t(key);
    return translated !== key ? translated : fallback;
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Error and success messages */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      {/* Header with title and month selection */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            {getText('contador.pageTitle', 'Contabilidade & Impostos Alemães')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getText('contador.pageSubtitle', 'Gestão fiscal e contábil especializada para o mercado alemão')}
          </Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="month-select-label">{getText('contador.selecioneMes', 'Selecionar mês')}</InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select"
            value={selectedMonth}
            label={getText('contador.selecioneMes', 'Selecionar mês')}
            onChange={handleMonthChange}
          >
            {monthOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      
      {/* Informação fiscal alemã */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1">
          {getText('contador.infoDeutscheSteuern', 'Este módulo está adaptado às regulamentações fiscais alemãs, com suporte para cálculos de Mehrwertsteuer (IVA) e integrações com o sistema ELSTER.')}
        </Typography>
      </Paper>
      
      {/* Dashboard principal do contador */}
      <ContadorDashboard mes={selectedMonth} />
    </Box>
  );
};

export default Contador; 