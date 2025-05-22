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
  useTheme,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  PictureAsPdf as PictureAsPdfIcon
} from '@mui/icons-material';
import { format, addMonths } from 'date-fns';
import { ptBR, enUS, de, it } from 'date-fns/locale';
import {
  Euro as EuroIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon
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

// Função para gerar anos de 2022 até o ano atual + 5
const generateYearOptions = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2022; year <= 2030; year++) {
    years.push(year);
  }
  return years;
};

const TaxesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { isTaxProfileComplete } = useTaxProfile();
  
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TaxForecast | null>(null);
  
  const yearOptions = generateYearOptions();
  
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
  
  // Meses do ano para o select
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 1);
    return {
      value: i,
      label: format(date, 'MMMM', { locale: getDateLocale() })
    };
  });
  
  // Função para formatar o período selecionado (mês/ano)
  const formattedPeriod = () => {
    const date = new Date(selectedYear, selectedMonth, 1);
    return format(date, 'MMMM yyyy', { locale: getDateLocale() });
  };
  
  // Efeito para carregar dados quando o componente é montado
  useEffect(() => {
    if (isTaxProfileComplete) {
      loadTaxData();
    }
  }, []);
  
  // Função para carregar dados fiscais
  const loadTaxData = async () => {
    if (!isTaxProfileComplete) return; // Não carregar se o perfil fiscal não estiver completo
    
    setIsLoading(true);
    try {
      // Simular requisição à API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Gerar dados simulados com base no mês e ano selecionados
      const date = new Date(selectedYear, selectedMonth, 1);
      const mockData = generateMockTaxData(date);
      setData(mockData);
      setNetworkError(null);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setNetworkError('Falha ao carregar dados fiscais');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para atualizar os dados manualmente
  const handleRefresh = async () => {
    setIsLoading(true);
    setNetworkError(null);
    
    try {
      // Simular requisição à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerar novos dados simulados
      const date = new Date(selectedYear, selectedMonth, 1);
      const mockData = generateMockTaxData(date);
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
  
  // Função para exportar relatório em PDF
  const handleExportPDF = () => {
    toast.success('Exportando relatório fiscal em PDF...');
    setTimeout(() => {
      toast.success('Relatório "Resumo Tributário - ' + formattedPeriod() + '.pdf" exportado com sucesso!');
    }, 2000);
  };
  
  // Funções para manipular mudanças nos selects
  const handleMonthChange = (event: SelectChangeEvent) => {
    setSelectedMonth(Number(event.target.value));
  };
  
  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(Number(event.target.value));
  };
  
  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {tString('impostos.titulo', 'Resumo Tributário')}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {tString('impostos.subtitulo', 'Gerencie e visualize seus impostos')}
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
              {tString('impostos.comum.irParaPerfil', 'Ir para Perfil Fiscal')}
            </Button>
          }
        >
          {tString('impostos.comum.perfilIncompleto', 'Complete o Perfil Fiscal para habilitar o cálculo automático.')}
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
        <Box display="flex" alignItems="center" gap={1}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="month-select-label">{tString('impostos.comum.selecionarMes', 'Mês')}</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth.toString()}
              label={tString('impostos.comum.selecionarMes', 'Mês')}
              onChange={handleMonthChange}
              size="small"
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel id="year-select-label">{tString('impostos.comum.selecionarAno', 'Ano')}</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear.toString()}
              label={tString('impostos.comum.selecionarAno', 'Ano')}
              onChange={handleYearChange}
              size="small"
            >
              {yearOptions.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            size="small"
            onClick={loadTaxData}
            disabled={isLoading || !isTaxProfileComplete}
          >
            {tString('impostos.comum.buscar', 'Buscar')}
          </Button>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPDF}
            disabled={isLoading || !data || !isTaxProfileComplete}
            color="primary"
          >
            {tString('impostos.comum.exportarPDF', 'Exportar Relatório Fiscal (PDF)')}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading || !isTaxProfileComplete}
          >
            {tString('impostos.comum.atualizarDados', 'Atualizar')}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={goToTaxProfile}
          >
            {tString('impostos.comum.perfilFiscal', 'Perfil Fiscal')}
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
                title={tString('impostos.iva.titulo', 'IVA')}
                value={data?.vatDue || 0}
                color="primary"
                icon={<EuroIcon />}
                tooltip={tString('impostos.iva.tooltip', 'Imposto sobre Valor Agregado')}
                description={tString('impostos.iva.descricao', 'O IVA é calculado sobre as vendas, com dedução do imposto pago nas compras. É o principal imposto sobre consumo na Alemanha.')}
                details={[
                  tString('impostos.iva.detalhe1', 'A alíquota padrão é de 19% para a maioria dos produtos e serviços'),
                  tString('impostos.iva.detalhe2', 'Deve ser declarado mensalmente ou trimestralmente'),
                  tString('impostos.iva.detalhe3', 'Empresas menores podem optar pelo regime de caixa')
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
                title={tString('impostos.gewerbe.titulo', 'Gewerbesteuer')}
                value={data?.tradeTaxDue || 0}
                color="secondary"
                icon={<BusinessIcon />}
                tooltip={tString('impostos.gewerbe.tooltip', 'Imposto Comercial')}
                description={tString('impostos.gewerbe.descricao', 'O Gewerbesteuer é um imposto municipal cobrado sobre o lucro operacional das empresas. A taxa varia conforme o município.')}
                details={[
                  tString('impostos.gewerbe.detalhe1', 'Calculado com base no lucro ajustado da empresa'),
                  tString('impostos.gewerbe.detalhe2', 'A taxa é determinada pelo Hebesatz (multiplicador) do município'),
                  tString('impostos.gewerbe.detalhe3', 'Pago trimestralmente como adiantamento')
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
                title={tString('impostos.corpSoli.titulo', 'KSt + Soli')}
                value={(data?.corpTaxDue || 0) + (data?.soliDue || 0)}
                color="success"
                icon={<AccountBalanceIcon />}
                tooltip={tString('impostos.corpSoli.tooltip', 'Imposto corporativo e taxa de solidariedade')}
                description={tString('impostos.corpSoli.descricao', 'O KSt é o imposto de renda corporativo, aplicado sobre o lucro tributável. O Soli é um adicional de 5,5% sobre o imposto corporativo.')}
                details={[
                  tString('impostos.corpSoli.detalhe1', 'Imposto Corporativo: taxa fixa de 15% sobre o lucro'),
                  tString('impostos.corpSoli.detalhe2', 'Taxa de Solidariedade: 5,5% adicional sobre o imposto calculado'),
                  tString('impostos.corpSoli.detalhe3', 'Pagamentos trimestrais antecipados baseados no lucro estimado')
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
                title={tString('impostos.folha.titulo', 'Folha & Sozial')}
                value={data?.payrollTaxDue || 0}
                color="warning"
                icon={<GroupIcon />}
                tooltip={tString('impostos.folha.tooltip', 'Impostos sobre folha de pagamento e contribuições sociais')}
                description={tString('impostos.folha.descricao', 'Inclui o Lohnsteuer (imposto retido sobre salários) e as contribuições sociais obrigatórias pagas pelo empregador.')}
                details={[
                  tString('impostos.folha.detalhe1', 'Inclui seguro saúde, aposentadoria, desemprego e cuidados'),
                  tString('impostos.folha.detalhe2', 'Geralmente dividido entre empregador e empregado'),
                  tString('impostos.folha.detalhe3', 'Pagamento mensal obrigatório via sistema eletrônico')
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
        month={formattedPeriod()}
      />
    </Container>
  );
};

export default TaxesPage; 