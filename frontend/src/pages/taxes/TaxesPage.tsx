import React, { useState, useEffect } from 'react';
import { 
  Container,
  Typography,
  Grid,
  Stack,
  Button,
  Alert,
  Box,
  Skeleton,
  Snackbar,
  IconButton,
  TextField,
  useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { format, addMonths } from 'date-fns';
import { ptBR, enUS, de, it } from 'date-fns/locale';
import {
  Euro as EuroIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import TaxCard from '../../components/taxes/TaxCard';
import TaxDetailsDrawer, { TaxForecast } from '../../components/taxes/details/TaxDetailsDrawer';
import { useTaxProfile } from '../../contexts/TaxProfileContext';

// Função para gerar dados mockados de impostos com base no mês
const generateMockTaxData = (date: Date): TaxForecast => {
  const month = date.getMonth() + 1; // getMonth() retorna 0-11
  const year = date.getFullYear();
  
  // Valor base que varia de acordo com o mês, para simular diferentes períodos
  const baseValue = (month * 1000) + ((year % 100) * 100);
  
  // Valores de impostos baseados no valor base, com algumas variações para parecer mais realista
  return {
    vatDue: baseValue * 0.19 * (Math.random() * 0.2 + 0.9), // IVA 19% com variação
    tradeTaxDue: baseValue * 0.035 * (Math.random() * 0.3 + 0.85), // Imposto Comercial ~3.5%
    corpTaxDue: baseValue * 0.15 * (Math.random() * 0.25 + 0.9), // Imposto Corporativo 15%
    soliDue: baseValue * 0.15 * 0.055 * (Math.random() * 0.15 + 0.95), // Taxa de Solidariedade 5.5% do imposto corporativo
    payrollTaxDue: baseValue * 0.22 * (Math.random() * 0.1 + 0.95) // Impostos sobre folha ~22%
  };
};

const TaxesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { isTaxProfileComplete } = useTaxProfile();
  
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TaxForecast | null>(null);
  
  // Formatar mês para a API (YYYY-MM)
  const formattedMonth = format(selectedMonth, 'yyyy-MM');
  
  // Função para garantir que t() retorne uma string
  const tString = (key: string, defaultValue = ''): string => {
    const value = t(key);
    return value === null || value === undefined ? defaultValue : String(value);
  };
  
  // Função para obter o locale de date-fns correspondente ao idioma atual
  const getDateLocale = () => {
    const lang = i18n.language.substring(0, 2);
    switch (lang) {
      case 'pt': return ptBR;
      case 'de': return de;
      case 'it': return it;
      default: return enUS;
    }
  };
  
  // Efeito para carregar dados simulados quando o mês é alterado
  useEffect(() => {
    if (!isTaxProfileComplete) return; // Não carregar se o perfil fiscal não estiver completo
    
    const loadMockData = async () => {
      setIsLoading(true);
      try {
        // Simular requisição à API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Gerar dados simulados
        const mockData = generateMockTaxData(selectedMonth);
        setData(mockData);
        setNetworkError(null);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setNetworkError('Falha ao carregar dados fiscais');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMockData();
  }, [selectedMonth, isTaxProfileComplete]);
  
  // Função para atualizar os dados manualmente
  const handleRefresh = async () => {
    setIsLoading(true);
    setNetworkError(null);
    
    try {
      // Simular requisição à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerar novos dados simulados
      const mockData = generateMockTaxData(selectedMonth);
      setData(mockData);
      toast.success('Dados fiscais atualizados');
    } catch (error) {
      setNetworkError('Falha ao atualizar dados');
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para navegar para a página de Perfil
  const goToTaxProfile = () => {
    navigate('/dashboard/perfil');
  };
  
  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {tString('taxes.title', 'Impostos')}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {tString('taxes.subtitle', 'Gerencie e visualize seus impostos')}
        </Typography>
      </Box>
      
      {!isTaxProfileComplete && (
        <Alert 
          severity="info" 
          sx={{ mb: 4 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={goToTaxProfile}
            >
              {tString('taxes.goToProfile', 'Ir para Perfil Fiscal')}
            </Button>
          }
        >
          {tString('taxes.profileMissing', 'Complete o Perfil Fiscal para habilitar o cálculo automático.')}
        </Alert>
      )}
      
      <Box 
        mb={4} 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getDateLocale()}>
          <DatePicker
            label={tString('taxes.selectMonth', 'Selecionar Mês')}
            views={['month', 'year']}
            value={selectedMonth}
            onChange={(newDate) => newDate && setSelectedMonth(newDate)}
            slotProps={{
              textField: {
                variant: 'outlined',
                fullWidth: true,
                sx: { minWidth: 200 }
              }
            }}
          />
        </LocalizationProvider>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading || !isTaxProfileComplete}
            sx={{ mr: 1 }}
          >
            {tString('common.refresh', 'Atualizar')}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={goToTaxProfile}
          >
            {tString('taxes.profile', 'Perfil Fiscal')}
          </Button>
        </Box>
      </Box>
      
      <Stack spacing={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={140} animation="wave" />
            ) : (
              <TaxCard
                title={tString('taxes.vat', 'IVA')}
                value={data?.vatDue || 0}
                color="primary"
                icon={<EuroIcon />}
                tooltip={tString('taxes.vatTooltip', 'Imposto sobre Valor Agregado')}
                description={tString('taxes.vatDescription', 'O IVA é calculado sobre as vendas, com dedução do imposto pago nas compras. É o principal imposto sobre consumo na Alemanha.')}
                details={[
                  tString('taxes.vatDetail1', 'A alíquota padrão é de 19% para a maioria dos produtos e serviços'),
                  tString('taxes.vatDetail2', 'Deve ser declarado mensalmente ou trimestralmente'),
                  tString('taxes.vatDetail3', 'Empresas menores podem optar pelo regime de caixa')
                ]}
                baseValue={data?.vatDue ? data.vatDue / 0.19 : 0}
                taxRate={0.19}
              />
            )}
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={140} animation="wave" />
            ) : (
              <TaxCard
                title={tString('taxes.trade', 'Gewerbesteuer')}
                value={data?.tradeTaxDue || 0}
                color="secondary"
                icon={<BusinessIcon />}
                tooltip={tString('taxes.tradeTooltip', 'Imposto Comercial')}
                description={tString('taxes.tradeDescription', 'O Gewerbesteuer é um imposto municipal cobrado sobre o lucro operacional das empresas. A taxa varia conforme o município.')}
                details={[
                  tString('taxes.tradeDetail1', 'Calculado com base no lucro ajustado da empresa'),
                  tString('taxes.tradeDetail2', 'A taxa é determinada pelo Hebesatz (multiplicador) do município'),
                  tString('taxes.tradeDetail3', 'Pago trimestralmente como adiantamento')
                ]}
                baseValue={data?.tradeTaxDue ? data.tradeTaxDue / 0.035 : 0}
                taxRate={0.035}
              />
            )}
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={140} animation="wave" />
            ) : (
              <TaxCard
                title={tString('taxes.corpSoli', 'KSt + Soli')}
                value={(data?.corpTaxDue || 0) + (data?.soliDue || 0)}
                color="success"
                icon={<AccountBalanceIcon />}
                tooltip={tString('taxes.corpSoliTooltip', 'Imposto corporativo e taxa de solidariedade')}
                description={tString('taxes.corpSoliDescription', 'O KSt é o imposto de renda corporativo, aplicado sobre o lucro tributável. O Soli é um adicional de 5,5% sobre o imposto corporativo.')}
                details={[
                  tString('taxes.corpSoliDetail1', 'Imposto Corporativo: taxa fixa de 15% sobre o lucro'),
                  tString('taxes.corpSoliDetail2', 'Taxa de Solidariedade: 5,5% adicional sobre o imposto calculado'),
                  tString('taxes.corpSoliDetail3', 'Pagamentos trimestrais antecipados baseados no lucro estimado')
                ]}
                baseValue={data?.corpTaxDue ? data.corpTaxDue / 0.15 : 0}
                taxRate={0.15}
              />
            )}
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={140} animation="wave" />
            ) : (
              <TaxCard
                title={tString('taxes.payroll', 'Folha & Sozial')}
                value={data?.payrollTaxDue || 0}
                color="warning"
                icon={<GroupIcon />}
                tooltip={tString('taxes.payrollTooltip', 'Impostos sobre folha de pagamento e contribuições sociais')}
                description={tString('taxes.payrollDescription', 'Inclui o Lohnsteuer (imposto retido sobre salários) e as contribuições sociais obrigatórias pagas pelo empregador.')}
                details={[
                  tString('taxes.payrollDetail1', 'Inclui seguro saúde, aposentadoria, desemprego e cuidados'),
                  tString('taxes.payrollDetail2', 'Geralmente dividido entre empregador e empregado'),
                  tString('taxes.payrollDetail3', 'Pagamento mensal obrigatório via sistema eletrônico')
                ]}
                baseValue={data?.payrollTaxDue ? data.payrollTaxDue / 0.22 : 0}
                taxRate={0.22}
              />
            )}
          </Grid>
        </Grid>
      </Stack>
      
      {/* Snackbar para erros de rede */}
      <Snackbar
        open={!!networkError}
        autoHideDuration={6000}
        onClose={() => setNetworkError(null)}
        message={networkError}
        action={
          <IconButton 
            size="small" 
            color="inherit" 
            onClick={() => setNetworkError(null)}
          >
            <RefreshIcon />
          </IconButton>
        }
      />
      
      {/* Manter o drawer para compatibilidade, mas não mostrar o botão para abri-lo */}
      <TaxDetailsDrawer 
        forecast={data || null}
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        month={formattedMonth}
      />
    </Container>
  );
};

export default TaxesPage; 