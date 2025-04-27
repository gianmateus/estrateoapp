import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Payment as PaymentIcon,
  AttachMoney as MoneyIcon,
  MoneyOff as ExpenseIcon,
  Add as AddIcon,
  BarChart as ChartIcon,
  Schedule as ScheduleIcon,
  SmartToy as AIIcon,
  SmartToy,
  Insights as InsightsIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFinanceiro, Transacao } from '../contexts/FinanceiroContext';
import { useInventario } from '../contexts/InventarioContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import mockDashboardData from '../mocks/mockDashboardData';
import { formatCurrency } from '../utils/formatters';
import Currency from '../components/Currency';
import { generateDashboardReport, generateDashboardReportFromDOM } from '../utils/reportGenerator';

// Interfaces for the dashboard API response
// Interfaces para a resposta da API do dashboard
interface DashboardData {
  resumoFinanceiro: {
    totalEntradas: number;
    totalSaidas: number;
    saldoAtual: number;
  };
  resumoInventario: {
    totalItens: number;
    itensCriticos: number;
  };
  estatisticasUso: {
    usuariosAtivosHoje: number;
    usuariosTotais: number;
  };
  recomendacoesIA: string[];
}

// Interfaces para os dados da API (existentes)
interface PaymentSummary {
  pagos: number;
  pendentes: number;
  total: number;
}

interface InventorySummary {
  itensCriticos: number;
  totalItens: number;
  valorTotal: number;
}

// Interface para os dados do gráfico
interface ChartDataItem {
  date: string;
  income: number;
  expenses: number;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transacoes, balanco } = useFinanceiro();
  const { itens, resumo } = useInventario();
  
  // Estados para dados da API
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [inventorySummaryData, setInventorySummaryData] = useState<InventorySummary | null>(null);
  const [criticalItemsCount, setCriticalItemsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for dashboard data from the API
  // Estado para os dados do dashboard da API
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
  // Dados do gráfico simplificado
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  
  // Recomendações da IA
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([
    t('sugestao1'),
    t('sugestao2'),
    t('sugestao3')
  ]);

  // Refs para os elementos a serem capturados no relatório
  const financialSectionRef = useRef<HTMLDivElement>(null);
  const aiSuggestionsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Estado para o snackbar de notificação
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Fetch data from the dashboard API endpoint
  // Buscar dados do endpoint da API do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch dashboard data from the API
        // Buscar dados do dashboard da API
        const response = await apiClient.get<DashboardData>('/dashboard');
        setDashboardData(response.data);
        
        // Update AI recommendations if they're provided
        // Atualizar recomendações de IA se fornecidas
        if (response.data.recomendacoesIA && response.data.recomendacoesIA.length > 0) {
          setAiRecommendations(response.data.recomendacoesIA);
        }
        
        // Fetch other summaries as before
        // Buscar outros resumos como antes
        // Buscar resumo de pagamentos
        const paymentResponse = await apiClient.get<PaymentSummary>('/pagamentos/resumo');
        setPaymentSummary(paymentResponse.data);
        
        // Buscar resumo do inventário
        const inventoryResponse = await apiClient.get<InventorySummary>('/inventario/resumo');
        setInventorySummaryData(inventoryResponse.data);
        
        // Buscar itens críticos
        const suggestionsResponse = await apiClient.get('/inventario/sugestoes');
        setCriticalItemsCount(suggestionsResponse.data.itensCriticos);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        
        // Usar dados mockados no modo de desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log('Usando dados mockados no modo de desenvolvimento');
          
          // Configurar dados mockados
          setDashboardData({
            resumoFinanceiro: {
              saldoAtual: mockDashboardData.saldoAtual,
              totalEntradas: mockDashboardData.entradasHoje,
              totalSaidas: mockDashboardData.saidasHoje
            },
            resumoInventario: {
              totalItens: mockDashboardData.itensTotal,
              itensCriticos: mockDashboardData.itensAbaixoMin
            },
            estatisticasUso: {
              usuariosAtivosHoje: 5,
              usuariosTotais: 15
            },
            recomendacoesIA: mockDashboardData.sugestoesIA
          });
          
          setAiRecommendations(mockDashboardData.sugestoesIA);
          
          // Configurar outros dados mockados
          setPaymentSummary({
            pagos: 12,
            pendentes: 5,
            total: 17
          });
          
          setInventorySummaryData({
            itensCriticos: mockDashboardData.itensAbaixoMin,
            totalItens: mockDashboardData.itensTotal,
            valorTotal: mockDashboardData.valorEstoque
          });
          
          setCriticalItemsCount(mockDashboardData.itensAbaixoMin);
          
          // Definir erro como mensagem de aviso, não como erro fatal
          setError('mockdata_warning');
        } else {
          // Em produção, ainda mostra a mensagem de erro
          setError('Erro ao carregar o painel. Tente novamente mais tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Preparar dados para o gráfico de barras
    const today = new Date();
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
      const dateObj = new Date();
      dateObj.setDate(today.getDate() - (6 - i));
      return dateObj.toISOString().split('T')[0];
    });

    const processedData = lastSevenDays.map(dateString => {
      const dailyTransactions = transacoes.filter((t: Transacao) => t.data.startsWith(dateString));
      const incomeAmount = dailyTransactions
        .filter((t: Transacao) => t.tipo === 'entrada')
        .reduce((acc: number, t: Transacao) => acc + t.valor, 0);
      const expenseAmount = dailyTransactions
        .filter((t: Transacao) => t.tipo === 'saida')
        .reduce((acc: number, t: Transacao) => acc + t.valor, 0);

      // Formatar a data para exibição mais amigável
      const dateObj = new Date(dateString);
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const formattedDate = `${day}/${month}`;

      return {
        date: formattedDate,
        income: incomeAmount,
        expenses: expenseAmount
      };
    });

    setChartData(processedData);
  }, [transacoes]);

  const getTodayIncome = (): number => {
    const today = new Date().toISOString().split('T')[0];
    return transacoes
      .filter((t: Transacao) => t.data.startsWith(today) && t.tipo === 'entrada')
      .reduce((acc: number, t: Transacao) => acc + t.valor, 0);
  };

  const getTodayExpenses = (): number => {
    const today = new Date().toISOString().split('T')[0];
    return transacoes
      .filter((t: Transacao) => t.data.startsWith(today) && t.tipo === 'saida')
      .reduce((acc: number, t: Transacao) => acc + t.valor, 0);
  };

  // Função para gerar relatório em PDF
  const handleGenerateReport = async () => {
    try {
      // Método 1: Gerar relatório com dados estruturados
      await generateDashboardReport(
        {
          currentDate: new Date(),
          balance: Number(dashboardData?.resumoFinanceiro?.saldoAtual || balanco?.saldoAtual || 0),
          todayIncome: Number(getTodayIncome()),
          todayExpenses: Number(getTodayExpenses()),
          payments: {
            total: paymentSummary?.total || 0,
            paid: paymentSummary?.pagos || 0,
            pending: paymentSummary?.pendentes || 0
          },
          inventory: {
            totalItems: dashboardData?.resumoInventario.totalItens || inventorySummaryData?.totalItens || 0,
            criticalItems: dashboardData?.resumoInventario.itensCriticos || criticalItemsCount || 0,
            totalValue: Number(inventorySummaryData?.valorTotal || 0)
          },
          aiSuggestions: aiRecommendations
        },
        t
      );
      
      /* Método alternativo: capturar elementos DOM
      await generateDashboardReportFromDOM(
        ['financial-overview', 'ai-suggestions', 'chart-container'],
        t
      ); */
      
      setSnackbar({
        open: true,
        message: t('relatorioGeradoComSucesso'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setSnackbar({
        open: true,
        message: t('erroAoGerarRelatorio'),
        severity: 'error'
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Show loading indicator while data is being fetched
  // Mostrar indicador de carregamento enquanto os dados são buscados
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if there was a problem
  // Mostrar mensagem de erro se ocorreu algum problema
  if (error && error !== 'mockdata_warning') {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {error === 'mockdata_warning' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('demoBanner')}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {t('saudacao')}, {user?.nome || t('usuario')}
          </Typography>
          
          <Typography variant="h5" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
            {t('visaoGeral')}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PdfIcon />}
          onClick={handleGenerateReport}
        >
          {t('gerarRelatorio')}
        </Button>
      </Box>
      
      {/* Visão Geral Financeira */}
      <Grid container spacing={3} sx={{ mb: 4 }} id="financial-overview" ref={financialSectionRef}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {t('balanco_atual')}
            </Typography>
            <Box display="flex" alignItems="center">
              <MoneyIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Currency 
                value={Number(dashboardData?.resumoFinanceiro?.saldoAtual || balanco?.saldoAtual || 0)} 
                variant="h4"
              />
            </Box>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('entrada_hoje')}
                  </Typography>
                  <Currency
                    value={Number(getTodayIncome())}
                    variant="body1"
                    color="success.main"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('saida_hoje')}
                  </Typography>
                  <Currency
                    value={Number(getTodayExpenses())}
                    variant="body1"
                    color="error.main"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {t('pagamentos')}
            </Typography>
            <Box display="flex" alignItems="center">
              <PaymentIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h4">
                {paymentSummary?.total || 0}
              </Typography>
            </Box>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Chip 
                    icon={<AttachMoneyIcon />} 
                    label={`${t('pagos')}: ${paymentSummary?.pagos || 0}`} 
                    color="success" 
                    size="small" 
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip 
                    icon={<ScheduleIcon />} 
                    label={`${t('pendentes')}: ${paymentSummary?.pendentes || 0}`} 
                    color="warning" 
                    size="small" 
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {t('inventario')}
            </Typography>
            <Box display="flex" alignItems="center">
              <InventoryIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h4">
                {dashboardData?.resumoInventario.totalItens || inventorySummaryData?.totalItens || 0}
              </Typography>
            </Box>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('valor_total')}
                  </Typography>
                  <Currency
                    value={Number(inventorySummaryData?.valorTotal || 0)}
                    variant="body1"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip 
                    icon={<WarningIcon />} 
                    label={`${t('itens_criticos')}: ${dashboardData?.resumoInventario.itensCriticos || criticalItemsCount}`} 
                    color="error" 
                    size="small" 
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Estatísticas de Uso - Nova Seção */}
      {dashboardData?.estatisticasUso && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>{t('estatisticasUso')}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                      {t('usuariosAtivosHoje')}:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {dashboardData.estatisticasUso.usuariosAtivosHoje}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                      {t('usuariosTotais')}:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {dashboardData.estatisticasUso.usuariosTotais}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Gráfico Financeiro */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: 2 }} id="chart-container" ref={chartRef}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('movimentacoes_financeiras')}</Typography>
              <IconButton size="small" color="primary" onClick={() => navigate('/dashboard/financeiro')}>
                <ChartIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ height: 270 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip 
                    formatter={(value) => formatCurrency(Number(value))} 
                  />
                  <Bar 
                    name={t('entradas') || "Entradas"} 
                    dataKey="income" 
                    fill="#4caf50" 
                  />
                  <Bar 
                    name={t('saidas') || "Saídas"} 
                    dataKey="expenses" 
                    fill="#f44336" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Cards com Sugestões da IA */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: 2 }} id="ai-suggestions" ref={aiSuggestionsRef}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('sugestoes_ia')}</Typography>
              <AIIcon color="primary" />
            </Box>
            
            <List dense>
              {aiRecommendations.map((recommendation, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <SmartToy fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={recommendation} />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button 
                size="small" 
                variant="outlined" 
                color="primary" 
                startIcon={<InsightsIcon />}
              >
                {t('verMaisInsights')}
              </Button>
              <Chip 
                icon={<ScheduleIcon />} 
                label={t('geradoHoje')}
                color="primary"
                size="small"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Seção de Ações Rápidas */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>{t('acoes_rapidas')}</Typography>
            
            <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/dashboard/pagamentos/novo')}
              >
                {t('registrarPagamento')}
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/dashboard/inventario/novo')}
              >
                {t('adicionarItem')}
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<TrendingUpIcon />}
                onClick={() => navigate('/dashboard/financeiro')}
              >
                {t('registrarTransacao')}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Snackbar de notificação */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard; 