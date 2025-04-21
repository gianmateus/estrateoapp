import React, { useState, useEffect, useMemo } from 'react';
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
  Alert
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
  Insights as InsightsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFinanceiro, Transacao } from '../contexts/FinanceiroContext';
import { useInventario } from '../contexts/InventarioContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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
    'Seu estoque de batatas está abaixo do mínimo, considere reabastecer',
    'As vendas tendem a aumentar 20% nos finais de semana, prepare seu estoque',
    'Seus gastos com fornecedores aumentaram 15% este mês'
  ]);

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
        setError('Erro ao carregar o painel. Tente novamente mais tarde.');
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
  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('saudacao')}, {user?.nome || 'Usuário'}
      </Typography>
      
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium', color: 'text.secondary' }}>
        {t('visaoGeral')}
      </Typography>
      
      {/* Visão Geral Financeira */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {t('balanco_atual')}
            </Typography>
            <Box display="flex" alignItems="center">
              <MoneyIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h4">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  Number(dashboardData?.resumoFinanceiro?.saldoAtual || balanco?.saldoAtual || 0)
                )}
              </Typography>
            </Box>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('entrada_hoje')}
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(getTodayIncome()))}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('saida_hoje')}
                  </Typography>
                  <Typography variant="body1" color="error.main">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(getTodayExpenses()))}
                  </Typography>
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
                  <Typography variant="body1">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(inventorySummaryData?.valorTotal || 0))}
                  </Typography>
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
      
      {/* Estatísticas de Uso - New Section */}
      {dashboardData?.estatisticasUso && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Estatísticas de Uso</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                      Usuários Ativos Hoje:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {dashboardData.estatisticasUso.usuariosAtivosHoje}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                      Total de Usuários:
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
          <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('ultimosMovimentos')}</Typography>
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
                    formatter={(value) => 
                      new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(Number(value))
                    } 
                  />
                  <Bar 
                    name={t('entradas')} 
                    dataKey="income" 
                    fill="#4caf50" 
                  />
                  <Bar 
                    name={t('saidas')} 
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
          <Paper elevation={2} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('sugestoesIA')}</Typography>
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
            <Typography variant="h6" gutterBottom>{t('acoesRapidas')}</Typography>
            
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
    </Box>
  );
};

export default Dashboard; 