/**
 * Contador (Accountant) Module
 * Main page component that displays financial data organized for the accountant
 * Includes summary cards, charts, detailed tables and export functionality
 * 
 * Módulo do Contador
 * Componente principal que exibe dados financeiros organizados para o contador
 * Inclui cards de resumo, gráficos, tabelas detalhadas e funcionalidade de exportação
 */
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  SelectChangeEvent,
  Divider, 
  useTheme,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  AttachMoney, 
  Money, 
  AccountBalance, 
  People, 
  PictureAsPdf 
} from '@mui/icons-material';
import ResumoMensalCard from '../components/contador/ResumoMensalCard';
import GraficoReceitasDespesas from '../components/contador/GraficoReceitasDespesas';
import TabelaEntradas from '../components/contador/TabelaEntradas';
import TabelaSaidas from '../components/contador/TabelaSaidas';
import TabelaFuncionarios from '../components/contador/TabelaFuncionarios';
import BotaoGerarRelatorio from '../components/contador/BotaoGerarRelatorio';

// Import services from the contador module
// Importar serviços do módulo contador
import dataService, { ContadorData } from '../modules/contador/services/dataService';
import relatorioService from '../modules/contador/services/relatorioService';

/**
 * Returns an array of months for dropdown selection
 * @param count Number of months to generate (default 12)
 * @returns Array of month objects with date and formatted label
 * 
 * Retorna um array de meses para seleção no dropdown
 * @param count Número de meses a gerar (padrão 12)
 * @returns Array de objetos de mês com data e rótulo formatado
 */
const getMonthOptions = (count = 12) => {
  const options = [];
  let currentDate = new Date();
  
  for (let i = 0; i < count; i++) {
    const monthDate = subMonths(currentDate, i);
    options.push({
      value: format(monthDate, 'yyyy-MM'),
      label: format(monthDate, 'MMMM yyyy', { locale: ptBR })
    });
  }
  
  return options;
};

/**
 * Contador (Accountant) page component
 * Displays financial data organized for accounting purposes
 * 
 * Componente da página do Contador
 * Exibe dados financeiros organizados para fins contábeis
 */
const Contador: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [contadorData, setContadorData] = useState<ContadorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const monthOptions = getMonthOptions();
  
  // Handle month selection change
  const handleMonthChange = (event: SelectChangeEvent) => {
    setSelectedMonth(event.target.value as string);
  };
  
  // Load data when month changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataService.getContadorData(selectedMonth);
        setContadorData(data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(t('erroAoBuscarDados'));
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedMonth, t]);
  
  // Handle PDF report generation
  const handleGenerateReport = async () => {
    if (!contadorData) return;
    
    try {
      setReportLoading(true);
      setError(null);
      
      // Call report service
      await relatorioService.downloadRelatorio(selectedMonth);
      
      // Show success message
      setSuccessMessage(t('relatorioGeradoComSucesso'));
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
      setError(t('erroAoGerarRelatorio'));
    } finally {
      setReportLoading(false);
    }
  };
  
  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };
  
  if (loading && !contadorData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6">{t('carregando')}</Typography>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          {t('contador.titulo')}
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="month-select-label">{t('contador.selecioneMes')}</InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select"
            value={selectedMonth}
            label={t('contador.selecioneMes')}
            onChange={handleMonthChange}
            disabled={loading}
          >
            {monthOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Introduction text */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1">
          {t('contador.introducao')}
        </Typography>
      </Paper>
      
      {contadorData && (
        <>
          {/* Summary Cards */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
            {t('contador.resumoGeral')}
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <ResumoMensalCard 
                title={t('contador.receitaTotal')}
                value={contadorData.resumo.receita}
                icon={<AttachMoney fontSize="large" />}
                color="#4caf50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ResumoMensalCard 
                title={t('contador.despesasTotal')}
                value={contadorData.resumo.despesas}
                icon={<Money fontSize="large" />}
                color="#f44336"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ResumoMensalCard 
                title={t('contador.saldoFinal')}
                value={contadorData.resumo.saldo}
                icon={<AccountBalance fontSize="large" />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ResumoMensalCard 
                title={t('contador.totalFuncionarios')}
                value={contadorData.resumo.funcionariosPagos}
                icon={<People fontSize="large" />}
                color="#ff9800"
                isCount
              />
            </Grid>
          </Grid>
          
          {/* Revenue vs Expenses Chart */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
            {t('contador.graficoReceitas')}
          </Typography>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <GraficoReceitasDespesas data={contadorData.graficoData} />
          </Paper>
          
          {/* Detailed Tables */}
          {/* Income Table */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
            {t('contador.tabelaEntradas')}
          </Typography>
          
          <Paper sx={{ mb: 4, overflow: 'hidden' }}>
            <TabelaEntradas data={contadorData.entradas} />
          </Paper>
          
          {/* Expenses Table */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
            {t('contador.tabelaSaidas')}
          </Typography>
          
          <Paper sx={{ mb: 4, overflow: 'hidden' }}>
            <TabelaSaidas data={contadorData.saidas} />
          </Paper>
          
          {/* Employees Table */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
            {t('contador.tabelaFuncionarios')}
          </Typography>
          
          <Paper sx={{ mb: 4, overflow: 'hidden' }}>
            <TabelaFuncionarios data={contadorData.funcionarios} />
          </Paper>
          
          {/* Export Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <BotaoGerarRelatorio 
              onClick={handleGenerateReport} 
              loading={reportLoading} 
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Contador; 