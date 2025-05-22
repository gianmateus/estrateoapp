/**
 * Contador Dashboard específico para o mercado alemão e europeu
 * 
 * Este componente implementa um dashboard contábil completo com:
 * - Cálculos automáticos de impostos alemães (Mehrwertsteuer/VAT, Gewerbesteuer)
 * - Indicadores financeiros relevantes para o mercado europeu
 * - Preparação para integração com o sistema ELSTER
 * - Suporte ao formato XBRL
 */
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CardImposto from '../../components/contador/CardImposto';
import ResumoMensalCard from '../../components/contador/ResumoMensalCard';
import RelatoriosFiscais from './RelatoriosFiscais';
import ConfiguracoesImpostos from './ConfiguracoesImpostos';

// Importar ícones
import {
  ReceiptLong,
  Euro,
  AccountBalance,
  Business,
  BarChart,
  Receipt
} from '@mui/icons-material';

// Importar serviços e utilidades
import { getContadorData } from './services/dataService';
import { calcularImpostosAlemanha } from './utils/calculosFiscais';

// Interface para dados de impostos alemães
interface ImpostosAlemanha {
  mehrwertsteuer: {
    normal: number;
    reduzido: number;
    total: number;
  };
  gewerbesteuer: number;
  einkommensteuer: number;
  koerperschaftsteuer: number;
  solidaritaetszuschlag: number;
}

// Interface para props do componente
interface ContadorDashboardProps {
  mes: string;
}

const ContadorDashboard: React.FC<ContadorDashboardProps> = ({ mes }) => {
  const { t, i18n } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [impostos, setImpostos] = useState<ImpostosAlemanha | null>(null);
  const [taxRate, setTaxRate] = useState<string>('normal'); // normal (19%) ou reduzido (7%)

  // Função para garantir que o texto da tradução não seja null
  const getText = (key: string, fallback: string): string => {
    const translated = t(key);
    return translated !== key ? translated : fallback;
  };

  // Carregar dados quando o mês muda
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Carregar dados financeiros do mês selecionado
        const contadorData = await getContadorData(mes);
        
        // Calcular impostos alemães baseado nos dados carregados
        const dadosImpostos = calcularImpostosAlemanha(contadorData);
        setImpostos(dadosImpostos);
      } catch (err) {
        console.error('Erro ao carregar dados fiscais:', err);
        setError(getText('erroAoBuscarDadosFiscais', 'Erro ao buscar dados fiscais'));
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [mes, t]);

  // Alternar entre as abas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Alterar a alíquota de imposto
  const handleTaxRateChange = (event: SelectChangeEvent) => {
    setTaxRate(event.target.value);
  };

  // Renderizar indicadores de impostos alemães
  const renderImpostosCards = () => {
    if (!impostos) return null;

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CardImposto 
            tipo={getText('contador.impostos.mehrwertsteuer', 'Mehrwertsteuer (IVA)')}
            valor={taxRate === 'normal' ? impostos.mehrwertsteuer.normal : impostos.mehrwertsteuer.reduzido}
            icone={<Euro />}
            cor="primary"
            legenda={getText('contador.impostos.mehrwertsteuerDesc', 'Imposto sobre valor agregado - taxa padrão 19%')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardImposto 
            tipo={getText('contador.impostos.gewerbesteuer', 'Gewerbesteuer')}
            valor={impostos.gewerbesteuer}
            icone={<Business />}
            cor="secondary"
            legenda={getText('contador.impostos.gewerbesteuerDesc', 'Imposto comercial municipal')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardImposto 
            tipo={getText('contador.impostos.einkommensteuer', 'Einkommensteuer')}
            valor={impostos.einkommensteuer}
            icone={<ReceiptLong />}
            cor="warning"
            legenda={getText('contador.impostos.einkommensteuerDesc', 'Imposto de renda para pessoas físicas')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardImposto 
            tipo={getText('contador.impostos.solidaritaetszuschlag', 'Solidaritätszuschlag')}
            valor={impostos.solidaritaetszuschlag}
            icone={<AccountBalance />}
            cor="success"
            legenda={getText('contador.impostos.solidaritaetszuschlagDesc', 'Taxa de solidariedade sobre impostos')}
          />
        </Grid>
      </Grid>
    );
  };

  // Exibir indicador de carregamento
  if (loading && !impostos) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {getText('contador.dashboardTitle', 'Dashboard Contábil Alemão')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {getText('contador.dashboardDesc', 'Visão geral de indicadores fiscais e cálculos de impostos alemães')}
        </Typography>
      </Box>

      {/* Seletor de alíquota de Mehrwertsteuer */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="subtitle1" fontWeight="medium">
              {getText('contador.configuracoes.taxRateTitle', 'Alíquota de Mehrwertsteuer (IVA)')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getText('contador.configuracoes.taxRateDesc', 'Selecione a alíquota de IVA a ser aplicada')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="tax-rate-select-label">
                {getText('contador.configuracoes.taxRate', 'Alíquota')}
              </InputLabel>
              <Select
                labelId="tax-rate-select-label"
                id="tax-rate-select"
                value={taxRate}
                label={getText('contador.configuracoes.taxRate', 'Alíquota')}
                onChange={handleTaxRateChange}
              >
                <MenuItem value="normal">{getText('contador.configuracoes.taxRateNormal', 'Normal')} (19%)</MenuItem>
                <MenuItem value="reduzido">{getText('contador.configuracoes.taxRateReduced', 'Reduzida')} (7%)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Cards de impostos */}
      {renderImpostosCards()}

      {/* Abas para diferentes tipos de relatórios */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={getText('contador.abas.relatoriosFiscais', 'Relatórios Fiscais')} icon={<BarChart />} iconPosition="start" />
          <Tab label={getText('contador.abas.configuracoes', 'Configurações')} icon={<Receipt />} iconPosition="start" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <RelatoriosFiscais mes={mes} impostos={impostos} />
          )}
          
          {tabValue === 1 && (
            <ConfiguracoesImpostos mes={mes} taxRate={taxRate} onTaxRateChange={handleTaxRateChange} />
          )}
        </Box>
      </Paper>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
        {getText('contador.conformidadeGdpr', 'Todos os dados são processados e protegidos de acordo com as diretrizes do GDPR')}
      </Typography>
    </Box>
  );
};

export default ContadorDashboard; 