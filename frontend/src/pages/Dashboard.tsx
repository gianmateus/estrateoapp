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
  Snackbar,
  useTheme
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
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
  PictureAsPdf as PdfIcon,
  Receipt as ReceiptIcon,
  Payments as PaymentsIcon,
  AssignmentInd as AssignmentIndIcon,
  BeachAccess as BeachAccessIcon,
  Event as EventIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFinanceiro, Transacao } from '../contexts/FinanceiroContext';
import { useInventario } from '../contexts/InventarioContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import mockDashboardData from '../mocks/mockDashboardData';
import { formatCurrency } from '../utils/formatters';
import Currency from '../components/Currency';
import { generateDashboardReport, generateDashboardReportFromDOM } from '../utils/reportGenerator';
import ParcelamentosCard from '../components/dashboard/ParcelamentosCard';
import ResponsiveGrid from '../components/common/ResponsiveGrid';
import MotionButton from '../components/common/MotionButton';
import { motion } from 'framer-motion';
import MetricCard from '../components/ui/MetricCard';
import EmptyState from '../components/ui/EmptyState';
import FinanceCharts from '../components/dashboard/FinanceCharts';
import { RelatorioModalDashboard } from '../components/Relatorios/RelatorioModalDashboard';

// Importar os novos componentes modulares
// Import new modular components
import DashboardComponents from '../components/dashboard'; 

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
  
  // Novos campos para parcelamentos
  recebiveisFuturos: Array<{
    id: string;
    descricao: string;
    valor: number;
    dataPrevista: string;
    statusRecebimento: string;
    cliente: string;
  }>;
  parcelamentosAbertos: Array<{
    id: string;
    descricao: string;
    valor: number;
    parcelasPagas: number;
    totalParcelas: number;
    proximaParcela: {
      valor: number;
      data: string;
    };
    tipo: 'entrada' | 'saida';
  }>;
  totaisPorCategoria: Array<{
    categoria: string;
    valorEntradas: number;
    valorSaidas: number;
    saldo: number;
  }>;
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

// Interface para funcionários em férias
interface FuncionarioFerias {
  id: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
  diasRestantes: number;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transacoes, balanco } = useFinanceiro();
  const { itens, resumo } = useInventario();
  const theme = useTheme();
  
  // Verificar se o sistema prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
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

  const [funcionariosEmFerias, setFuncionariosEmFerias] = useState<FuncionarioFerias[]>([]);
  const [carregandoFerias, setCarregandoFerias] = useState<boolean>(false);

  // Variantes de animação para fade-in
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  // Animação escalonada para cards
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const [openModal, setOpenModal] = useState(false);

  // Fetch data from the dashboard API endpoint
  // Buscar dados do endpoint da API do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Tentar buscar da API real
        const response = await apiClient.get('/dashboard');
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
      } catch (error) {
        console.log('Erro ao buscar dados do dashboard, usando dados simulados', error);
        
        // Usar dados simulados em caso de erro
        const mockData: DashboardData = {
          ...mockDashboardData,
          resumoFinanceiro: {
            saldoAtual: mockDashboardData.saldoAtual || 0,
            totalEntradas: mockDashboardData.entradasHoje || 0,
            totalSaidas: mockDashboardData.saidasHoje || 0
          },
          resumoInventario: {
            totalItens: mockDashboardData.itensTotal || 0,
            itensCriticos: mockDashboardData.itensAbaixoMin || 0
          },
          estatisticasUso: {
            usuariosAtivosHoje: 5,
            usuariosTotais: 15
          },
          recomendacoesIA: mockDashboardData.sugestoesIA || [],
          
          // Adicionar dados simulados para parcelamentos
          recebiveisFuturos: [
            {
              id: '1',
              descricao: 'Pagamento de cliente XYZ',
              valor: 1500.00,
              dataPrevista: '2023-10-15',
              statusRecebimento: 'pendente',
              cliente: 'Cliente XYZ'
            },
            {
              id: '2',
              descricao: 'Serviço de consultoria',
              valor: 2800.00,
              dataPrevista: '2023-10-20',
              statusRecebimento: 'parcialmente_recebido',
              cliente: 'Empresa ABC'
            },
            {
              id: '3',
              descricao: 'Aluguel de equipamento',
              valor: 750.00,
              dataPrevista: '2023-11-01',
              statusRecebimento: 'pendente',
              cliente: 'Cliente DEF'
            }
          ],
          parcelamentosAbertos: [
            {
              id: '1',
              descricao: 'Compra de equipamentos',
              valor: 3600.00,
              parcelasPagas: 2,
              totalParcelas: 6,
              proximaParcela: {
                valor: 600.00,
                data: '2023-10-15'
              },
              tipo: 'saida'
            },
            {
              id: '2',
              descricao: 'Venda de software',
              valor: 4800.00,
              parcelasPagas: 1,
              totalParcelas: 4,
              proximaParcela: {
                valor: 1200.00,
                data: '2023-10-10'
              },
              tipo: 'entrada'
            },
            {
              id: '3',
              descricao: 'Reforma do escritório',
              valor: 9000.00,
              parcelasPagas: 3,
              totalParcelas: 10,
              proximaParcela: {
                valor: 900.00,
                data: '2023-10-25'
              },
              tipo: 'saida'
            }
          ],
          totaisPorCategoria: [
            {
              categoria: 'Vendas',
              valorEntradas: 12500.00,
              valorSaidas: 0,
              saldo: 12500.00
            },
            {
              categoria: 'Serviços',
              valorEntradas: 8750.00,
              valorSaidas: 1200.00,
              saldo: 7550.00
            },
            {
              categoria: 'Operacional',
              valorEntradas: 0,
              valorSaidas: 5800.00,
              saldo: -5800.00
            },
            {
              categoria: 'Marketing',
              valorEntradas: 0,
              valorSaidas: 2300.00,
              saldo: -2300.00
            },
            {
              categoria: 'Aluguel',
              valorEntradas: 0,
              valorSaidas: 3500.00,
              saldo: -3500.00
            }
          ]
        };
        
        setDashboardData(mockData);
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

  // Buscar funcionários em férias
  useEffect(() => {
    const fetchFuncionariosEmFerias = async () => {
      setCarregandoFerias(true);
      try {
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Dados simulados de funcionários em férias
        const mockFuncionariosFerias: FuncionarioFerias[] = [
          {
            id: '1',
            nome: 'Ana Silva',
            dataInicio: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
            dataFim: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias no futuro
            diasRestantes: 10
          },
          {
            id: '2',
            nome: 'Pedro Santos',
            dataInicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
            dataFim: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 dias no futuro
            diasRestantes: 12
          },
          {
            id: '3',
            nome: 'Carla Oliveira',
            dataInicio: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias no futuro
            dataFim: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 dias no futuro
            diasRestantes: 0 // Ainda não começou
          }
        ];
        
        setFuncionariosEmFerias(mockFuncionariosFerias);
      } catch (error) {
        console.error('Erro ao buscar funcionários em férias:', error);
      } finally {
        setCarregandoFerias(false);
      }
    };
    
    fetchFuncionariosEmFerias();
  }, []);

  // Formatar data
  const formatarData = (dataString: string): string => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  // Verificar se as férias já começaram
  const feriasJaComecaram = (dataInicio: string): boolean => {
    const hoje = new Date();
    const inicio = new Date(dataInicio);
    return inicio <= hoje;
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
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 3
      }}
    >
      {/* Header fixo com botão de gerar relatório */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          py: 2,
          px: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 4
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          color="text.primary"
        >
          {t('dashboardObj.title')}
        </Typography>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<PdfIcon />}
            onClick={() => setOpenModal(true)}
            sx={{
              width: { xs: '100%', sm: 180 },
              height: 40,
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              '&:focus': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: 2
              }
            }}
          >
            {t('gerarRelatorio')}
          </Button>
        </motion.div>
      </Box>

      <RelatorioModalDashboard open={openModal} onClose={() => setOpenModal(false)} />

      {/* Conteúdo do Dashboard usando o componente principal */}
      {dashboardData && (
        <DashboardComponents
          dashboardData={dashboardData}
          chartData={chartData}
          todayIncome={getTodayIncome()}
          todayExpenses={getTodayExpenses()}
          funcionariosEmFerias={funcionariosEmFerias.length}
                  />
      )}

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2, boxShadow: theme.shadows[3] }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;