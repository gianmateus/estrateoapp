import React, { useState, useEffect, useRef } from 'react';
import { Grid, Box, Typography, Paper, Divider, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFinanceiro } from '../../contexts/FinanceiroContext';
import { useInventario } from '../../contexts/InventarioContext';
import apiClient from '../../services/api';
import mockDashboardData from '../../mocks/mockDashboardData';
import { EventBus } from '../../services/EventBus';

// Componentes
import FinancialSummaryCard from './FinancialSummaryCard';
import PayrollSummaryCard from './PayrollSummaryCard';
import EmployeesSummaryCard from './EmployeesSummaryCard';
import CalendarEventsSummary from './CalendarEventsSummary';
import StockAlertsSummary from './StockAlertsSummary';
import RevenueVsExpensesChart from './RevenueVsExpensesChart';
import ExpensesDistributionChart from './ExpensesDistributionChart';
import EmployeesGrowthChart from './EmployeesGrowthChart';

// Interface para os dados do dashboard
interface DashboardData {
  financeiro: {
    saldoAtual: number;
    proximasContas: {
      quantidade: number;
      valorTotal: number;
    };
  };
  folhaPagamento: {
    valorPago: number;
    valorPendente: number;
  };
  funcionarios: {
    total: number;
    ativos: number;
    emFerias: number;
  };
  estoque: {
    totalItens: number;
    itensCriticos: number;
  };
  calendario: {
    eventos: Array<{
      id: string;
      titulo: string;
      data: string;
      tipo: 'pagamento' | 'entrada' | 'ferias' | 'evento';
    }>;
  };
}

// Dados para os gráficos
interface FinancialChartData {
  ultimosMeses: Array<{
    mes: string;
    receitas: number;
    despesas: number;
  }>;
  distribuicaoGastos: Array<{
    categoria: string;
    valor: number;
    percentual: number;
  }>;
}

interface EmployeesChartData {
  historicoFuncionarios: Array<{
    mes: string;
    quantidade: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { balanco } = useFinanceiro();
  const { resumo } = useInventario();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [financialChartData, setFinancialChartData] = useState<FinancialChartData | null>(null);
  const [employeesChartData, setEmployeesChartData] = useState<EmployeesChartData | null>(null);

  // Referência para a atualização automática
  const eventSubscribed = useRef(false);

  // Buscar dados do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Tentar buscar dados da API
        const responseData = await apiClient.get<DashboardData>('/dashboard');
        setDashboardData(responseData.data);
        
        // Buscar dados dos gráficos
        const financialChartResponse = await apiClient.get<FinancialChartData>('/dashboard/charts/financial');
        setFinancialChartData(financialChartResponse.data);
        
        const employeesChartResponse = await apiClient.get<EmployeesChartData>('/dashboard/charts/employees');
        setEmployeesChartData(employeesChartResponse.data);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        
        // Em modo de desenvolvimento, usar dados mockados
        if (process.env.NODE_ENV === 'development') {
          console.log('Usando dados mockados para o dashboard');
          
          // Configurar dados mockados para o dashboard
          setDashboardData({
            financeiro: {
              saldoAtual: mockDashboardData.saldoAtual,
              proximasContas: {
                quantidade: 5,
                valorTotal: 3500
              }
            },
            folhaPagamento: {
              valorPago: 15000,
              valorPendente: 5000
            },
            funcionarios: {
              total: 12,
              ativos: 10,
              emFerias: 2
            },
            estoque: {
              totalItens: mockDashboardData.itensTotal,
              itensCriticos: mockDashboardData.itensAbaixoMin
            },
            calendario: {
              eventos: [
                { id: '1', titulo: 'Pagamento Fornecedor X', data: '2023-06-25', tipo: 'pagamento' },
                { id: '2', titulo: 'Recebimento Cliente Y', data: '2023-06-26', tipo: 'entrada' },
                { id: '3', titulo: 'Férias João Silva', data: '2023-06-28', tipo: 'ferias' }
              ]
            }
          });
          
          // Dados mockados para os gráficos
          setFinancialChartData({
            ultimosMeses: [
              { mes: 'Jan', receitas: 20000, despesas: 15000 },
              { mes: 'Fev', receitas: 22000, despesas: 14000 },
              { mes: 'Mar', receitas: 25000, despesas: 16000 },
              { mes: 'Abr', receitas: 27000, despesas: 18000 },
              { mes: 'Mai', receitas: 30000, despesas: 19000 },
              { mes: 'Jun', receitas: 32000, despesas: 20000 }
            ],
            distribuicaoGastos: [
              { categoria: 'Salários', valor: 15000, percentual: 50 },
              { categoria: 'Estoque', valor: 6000, percentual: 20 },
              { categoria: 'Infraestrutura', valor: 3000, percentual: 10 },
              { categoria: 'Marketing', valor: 3000, percentual: 10 },
              { categoria: 'Outros', valor: 3000, percentual: 10 }
            ]
          });
          
          setEmployeesChartData({
            historicoFuncionarios: [
              { mes: 'Jan', quantidade: 8 },
              { mes: 'Fev', quantidade: 8 },
              { mes: 'Mar', quantidade: 9 },
              { mes: 'Abr', quantidade: 10 },
              { mes: 'Mai', quantidade: 11 },
              { mes: 'Jun', quantidade: 12 }
            ]
          });
          
          setError('mockdata_warning');
        } else {
          setError('Erro ao carregar dados do dashboard. Tente novamente mais tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Registrar para eventos do EventBus para atualizações automáticas
    if (!eventSubscribed.current) {
      eventSubscribed.current = true;
      
      // Registrar para eventos que afetam o dashboard
      EventBus.on('pagamento.criado', () => fetchDashboardData());
      EventBus.on('pagamento.atualizado', () => fetchDashboardData());
      EventBus.on('pagamento.excluido', () => fetchDashboardData());
      EventBus.on('entrada.criada', () => fetchDashboardData());
      EventBus.on('entrada.atualizada', () => fetchDashboardData());
      EventBus.on('entrada.excluida', () => fetchDashboardData());
      EventBus.on('ferias.registradas', () => fetchDashboardData());
      EventBus.on('folga.registrada', () => fetchDashboardData());
      EventBus.on('ausencia.registrada', () => fetchDashboardData());
      EventBus.on('salario.pago', () => fetchDashboardData());
      EventBus.on('estoque.movimentado', () => fetchDashboardData());
      EventBus.on('estoque.item.abaixo.minimo', () => fetchDashboardData());
    }
    
    // Limpar event listeners no unmount
    return () => {
      if (eventSubscribed.current) {
        EventBus.removeAllListeners('pagamento.criado');
        EventBus.removeAllListeners('pagamento.atualizado');
        EventBus.removeAllListeners('pagamento.excluido');
        EventBus.removeAllListeners('entrada.criada');
        EventBus.removeAllListeners('entrada.atualizada');
        EventBus.removeAllListeners('entrada.excluida');
        EventBus.removeAllListeners('ferias.registradas');
        EventBus.removeAllListeners('folga.registrada');
        EventBus.removeAllListeners('ausencia.registrada');
        EventBus.removeAllListeners('salario.pago');
        EventBus.removeAllListeners('estoque.movimentado');
        EventBus.removeAllListeners('estoque.item.abaixo.minimo');
        
        eventSubscribed.current = false;
      }
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t('visaoGeralEmpresa')}
      </Typography>
      
      {error && error !== 'mockdata_warning' && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: theme.palette.error.light 
          }}
        >
          <Typography color="error">
            {error}
          </Typography>
        </Paper>
      )}
      
      {error === 'mockdata_warning' && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: theme.palette.warning.light 
          }}
        >
          <Typography color="warning.dark">
            {t('dadosMockadosAviso')}
          </Typography>
        </Paper>
      )}
      
      {/* Cards de resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <FinancialSummaryCard 
            isLoading={isLoading} 
            saldoAtual={dashboardData?.financeiro.saldoAtual || 0}
            proximasContas={dashboardData?.financeiro.proximasContas || { quantidade: 0, valorTotal: 0 }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <PayrollSummaryCard
            isLoading={isLoading}
            valorPago={dashboardData?.folhaPagamento.valorPago || 0}
            valorPendente={dashboardData?.folhaPagamento.valorPendente || 0}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <EmployeesSummaryCard
            isLoading={isLoading}
            totalFuncionarios={dashboardData?.funcionarios.total || 0}
            funcionariosAtivos={dashboardData?.funcionarios.ativos || 0}
            funcionariosEmFerias={dashboardData?.funcionarios.emFerias || 0}
          />
        </Grid>
      </Grid>
      
      {/* Alertas, Eventos e Relatórios */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <StockAlertsSummary 
            isLoading={isLoading}
            totalItens={dashboardData?.estoque.totalItens || 0}
            itensCriticos={dashboardData?.estoque.itensCriticos || 0}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <CalendarEventsSummary
            isLoading={isLoading}
            eventos={dashboardData?.calendario.eventos || []}
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ mb: 4 }} />
      
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t('dashboardGraficos')}
      </Typography>
      
      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <RevenueVsExpensesChart
            isLoading={isLoading}
            data={financialChartData?.ultimosMeses || []}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <ExpensesDistributionChart
            isLoading={isLoading}
            data={financialChartData?.distribuicaoGastos || []}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <EmployeesGrowthChart
            isLoading={isLoading}
            data={employeesChartData?.historicoFuncionarios || []}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 