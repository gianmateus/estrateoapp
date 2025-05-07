/**
 * Página de Impostos - Versão Premium
 * 
 * Gerencia a visualização e controle de impostos, incluindo consulta de valores devidos,
 * registro de pagamentos, configurações fiscais e relatórios.
 */
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Tabs, 
  Tab, 
  Button, 
  TextField, 
  Skeleton,
  Snackbar,
  Alert,
  useMediaQuery,
  Paper
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Euro as EuroIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  PeopleAlt as PeopleAltIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useTax } from '../contexts/TaxContext';
import CardImposto from '../components/contador/CardImposto';
import { format } from 'date-fns';

/**
 * Página principal de Impostos
 */
const Impostos: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Hook do contexto de impostos
  const { taxForecast, isLoading, error, fetchForecast } = useTax();

  // Estados locais da página
  const [tabAtiva, setTabAtiva] = useState(0);
  const [mesForecast, setMesForecast] = useState(format(new Date(), 'yyyy-MM'));
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Efeito para carregar dados e gerenciar erros
  useEffect(() => {
    fetchForecast(mesForecast);
    if (error) {
      setSnackbarOpen(true);
    }
  }, [mesForecast, fetchForecast, error]);

  // Handlers
  const handleCloseSnackbar = () => setSnackbarOpen(false);
  const handleRetry = () => {
    fetchForecast(mesForecast);
    setSnackbarOpen(false);
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabAtiva(newValue);
  };
  const handleMesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMesForecast(event.target.value);
    fetchForecast(event.target.value);
  };

  // Renderização da tab de previsão fiscal
  const renderPrevisaoFiscal = () => (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexDirection: isSmallScreen ? 'column' : 'row',
          gap: isSmallScreen ? 2 : 0
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {t('previsaoAutomatica', 'Previsão Automática')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label={t('mesFiscal', 'Mês Fiscal')}
            type="month"
            value={mesForecast}
            onChange={handleMesChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={() => fetchForecast(mesForecast)}
            disabled={isLoading}
          >
            {t('atualizar', 'Atualizar')}
          </Button>
        </Box>
      </Box>
      
      {isLoading ? (
        <Grid container spacing={4}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton 
                variant="rectangular" 
                height={160} 
                sx={{ 
                  borderRadius: 3,
                  width: '100%'
                }}
                animation="wave"
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <CardImposto 
              tipo={t('taxes.vat', 'Umsatzsteuer')}
              valor={taxForecast?.vatPayable}
              icone={<EuroIcon />}
              cor="primary"
              legenda={String(t('taxes.vatDescription', 'Imposto sobre valor agregado (IVA)'))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardImposto 
              tipo={t('taxes.trade', 'Gewerbesteuer')}
              valor={taxForecast?.tradeTax}
              icone={<BusinessIcon />}
              cor="neutral"
              legenda={String(t('taxes.tradeDescription', 'Imposto comercial (Gewerbesteuer)'))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardImposto 
              tipo={t('taxes.corp', 'Körperschaftsteuer')}
              valor={taxForecast?.corpTax}
              icone={<AccountBalanceIcon />}
              cor="success"
              legenda={String(t('taxes.corpDescription', 'Imposto de renda corporativo'))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardImposto 
              tipo={t('taxes.payroll', 'Lohnsteuer')}
              valor={taxForecast?.payrollTax}
              icone={<PeopleAltIcon />}
              cor="warning"
              legenda={String(t('taxes.payrollDescription', 'Impostos sobre folha de pagamento'))}
            />
          </Grid>
        </Grid>
      )}
      
      {!isLoading && !taxForecast && !error && (
        <Alert severity="info" sx={{ mt: 3 }}>
          {t('taxes.noData', 'Sem dados para o período selecionado')}
        </Alert>
      )}
      
      {taxForecast && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {t('previsaoCalculada', 'Previsão calculada para')}: <strong>{taxForecast?.mes || '---'}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('notaPrevisao', 'Os valores são estimativas baseadas no histórico e podem variar.')}
          </Typography>
        </Box>
      )}
    </Box>
  );

  // Renderização para outras tabs
  const renderEmConstrucao = () => (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h6" color="text.secondary">
        {t('moduloEmConstrucao', 'Este módulo está em construção')}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {t('voltarEmBreve', 'Volte em breve para novidades')}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Título principal */}
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          // Garantir que não haja borda inferior
          '&::after': {
            display: 'none'
          }
        }}
      >
        {t('impostos', 'Impostos')}
      </Typography>

      {/* Estrutura de tabs sem linha horizontal preta */}
      <Paper 
        elevation={0} 
        sx={{ 
          backgroundColor: 'transparent',
          mb: 4,
          // Desabilitar qualquer borda que possa aparecer
          '& .MuiTabs-root': {
            minHeight: 'auto',
            '&::before': {
              display: 'none'
            }
          }
        }}
      >
        <Tabs
          value={tabAtiva}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          // Removendo linha inferior das tabs
          TabIndicatorProps={{
            style: {
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
          sx={{
            // Corrigir a linha horizontal que aparece em baixo das tabs
            '& .MuiTabs-flexContainer': {
              borderBottom: 'none'
            },
            // Garantir que não exista nenhuma linha ou borda adicional
            '&::after, &::before': {
              display: 'none',
              content: 'none'
            }
          }}
        >
          <Tab 
            label={t('previsaoFiscal', 'Previsão Fiscal')}
            disableRipple
            sx={{ minWidth: 'auto', px: 3, py: 1.5 }}
          />
          <Tab 
            label={t('listaImpostos', 'Lista de Impostos')} 
            disableRipple
            sx={{ minWidth: 'auto', px: 3, py: 1.5 }}
          />
          <Tab 
            label={t('configuracoes', 'Configurações')} 
            disableRipple
            sx={{ minWidth: 'auto', px: 3, py: 1.5 }}
          />
          <Tab 
            label={t('relatorios', 'Relatórios')} 
            disableRipple
            sx={{ minWidth: 'auto', px: 3, py: 1.5 }}
          />
        </Tabs>
      </Paper>

      {/* Conteúdo das abas */}
      <Box sx={{ pt: 1 }}>
        {tabAtiva === 0 && renderPrevisaoFiscal()}
        {tabAtiva === 1 && renderEmConstrucao()}
        {tabAtiva === 2 && renderEmConstrucao()}
        {tabAtiva === 3 && renderEmConstrucao()}
      </Box>

      {/* Snackbar para tratamento de erros - Substitui o alerta fixo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              {t('tentar_novamente', 'Tentar novamente')}
            </Button>
          }
        >
          {t('erro_conexao', 'Erro ao carregar dados fiscais. Verifique sua conexão.')}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Impostos; 