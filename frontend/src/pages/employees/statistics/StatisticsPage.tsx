import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Download as DownloadIcon,
  BarChart as ChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  PaidOutlined as PaidIcon,
  Badge as StatusIcon,
  Group as DepartmentIcon,
  TrendingUp as TrendingIcon,
  Euro as EuroIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format, subMonths } from 'date-fns';

// Componentes personalizados
import StatisticsCard from '../../../components/ui/StatisticsCard';
import PeriodFilter from '../../../components/ui/PeriodFilter';
import CustomTooltip from '../../../components/ui/CustomTooltip';

// Interface para representar um funcionário
interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  dataContratacao: string; // formato ISO 8601
  salario: number;
  status: 'ativo' | 'inativo' | 'ferias' | 'licenca';
}

// Interface para as estatísticas de funcionários
interface FuncionarioStats {
  totalFuncionarios: number;
  totalAtivos: number;
  totalInativos: number;
  totalFerias: number;
  totalLicenca: number;
  custoTotal: number;
  departamentos: {
    nome: string;
    total: number;
    ativos: number;
    custoTotal: number;
  }[];
  cargos: {
    nome: string;
    total: number;
    custoMedio: number;
  }[];
  historicoContratacoes: {
    mes: string;
    contratacoes: number;
    desligamentos: number;
  }[];
  distribuicaoSalarial: {
    faixa: string;
    quantidade: number;
  }[];
}

/**
 * Página de estatísticas de funcionários
 * Exibe gráficos e dados sobre a equipe, departamentos, salários e tendências
 */
const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FuncionarioStats | null>(null);
  const [periodoInicio, setPeriodoInicio] = useState<Date | null>(
    subMonths(new Date(), 12) // 12 meses atrás
  );
  const [periodoFim, setPeriodoFim] = useState<Date | null>(new Date());
  const [departamentoFiltro, setDepartamentoFiltro] = useState<string>('todos');
  
  // Cores para os gráficos com base na paleta do tema
  const statusColors = [
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main
  ];
  
  const departmentColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    '#00C49F',
    '#FF8042',
    '#8884D8'
  ];

  // Formatador de moedas para Euros
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };
  
  // Mock de dados para desenvolvimento
  const mockFuncionarios: Funcionario[] = [
    {
      id: '1',
      nome: 'Maria Silva',
      cargo: 'Gerente',
      departamento: 'Administrativo',
      dataContratacao: '2021-03-15',
      salario: 4500,
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'João Santos',
      cargo: 'Chef de Cozinha',
      departamento: 'Cozinha',
      dataContratacao: '2020-05-10',
      salario: 3800,
      status: 'ativo'
    },
    {
      id: '3',
      nome: 'Ana Oliveira',
      cargo: 'Atendente',
      departamento: 'Atendimento',
      dataContratacao: '2022-01-20',
      salario: 2200,
      status: 'ferias'
    },
    {
      id: '4',
      nome: 'Pedro Costa',
      cargo: 'Auxiliar de Cozinha',
      departamento: 'Cozinha',
      dataContratacao: '2021-11-05',
      salario: 1800,
      status: 'ativo'
    },
    {
      id: '5',
      nome: 'Juliana Pereira',
      cargo: 'Recepcionista',
      departamento: 'Atendimento',
      dataContratacao: '2023-03-01',
      salario: 2000,
      status: 'licenca'
    },
    {
      id: '6',
      nome: 'Carlos Mendes',
      cargo: 'Contador',
      departamento: 'Financeiro',
      dataContratacao: '2022-08-15',
      salario: 3500,
      status: 'ativo'
    },
    {
      id: '7',
      nome: 'Roberto Alves',
      cargo: 'Auxiliar Administrativo',
      departamento: 'Administrativo',
      dataContratacao: '2023-01-10',
      salario: 2100,
      status: 'ativo'
    },
    {
      id: '8',
      nome: 'Fernanda Lima',
      cargo: 'Gerente',
      departamento: 'Atendimento',
      dataContratacao: '2021-07-22',
      salario: 4200,
      status: 'ativo'
    },
    {
      id: '9',
      nome: 'Marcelo Santos',
      cargo: 'Auxiliar de Limpeza',
      departamento: 'Operacional',
      dataContratacao: '2022-04-18',
      salario: 1500,
      status: 'ativo'
    },
    {
      id: '10',
      nome: 'Camila Rodrigues',
      cargo: 'Chef de Confeitaria',
      departamento: 'Cozinha',
      dataContratacao: '2021-09-30',
      salario: 3200,
      status: 'ferias'
    },
    {
      id: '11',
      nome: 'Rafael Sousa',
      cargo: 'Barista',
      departamento: 'Atendimento',
      dataContratacao: '2022-11-15',
      salario: 1900,
      status: 'inativo'
    },
    {
      id: '12',
      nome: 'Luciana Martins',
      cargo: 'Auxiliar Administrativo',
      departamento: 'Financeiro',
      dataContratacao: '2023-02-05',
      salario: 2200,
      status: 'ativo'
    }
  ];

  // Gerar dados mock para o histórico de contratações
  const gerarHistoricoContratacoes = () => {
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    return meses.map(mes => ({
      mes,
      contratacoes: Math.floor(Math.random() * 3),
      desligamentos: Math.floor(Math.random() * 2)
    }));
  };
  
  // Gerar dados mock para a distribuição salarial
  const gerarDistribuicaoSalarial = (funcionarios: Funcionario[]) => {
    const faixas = [
      '1000-1500',
      '1501-2000',
      '2001-3000',
      '3001-4000',
      '4001-5000',
      '5001+'
    ];
    
    const distribuicao = faixas.map(faixa => {
      let min = parseInt(faixa.split('-')[0]);
      let max = faixa.includes('+') 
        ? Number.MAX_SAFE_INTEGER 
        : parseInt(faixa.split('-')[1]);
      
      const quantidade = funcionarios.filter(
        f => f.salario >= min && f.salario <= max
      ).length;
      
      return { faixa, quantidade };
    });
    
    return distribuicao;
  };
  
  // Processar dados para estatísticas
  const processarDados = (funcionarios: Funcionario[]): FuncionarioStats => {
    // Contagens por status
    const totalAtivos = funcionarios.filter(f => f.status === 'ativo').length;
    const totalInativos = funcionarios.filter(f => f.status === 'inativo').length;
    const totalFerias = funcionarios.filter(f => f.status === 'ferias').length;
    const totalLicenca = funcionarios.filter(f => f.status === 'licenca').length;
    
    // Custo total
    const custoTotal = funcionarios.reduce((sum, f) => sum + f.salario, 0);
    
    // Agrupar por departamento
    const departamentos = funcionarios.reduce((acc, curr) => {
      const dep = acc.find(d => d.nome === curr.departamento);
      
      if (dep) {
        dep.total += 1;
        if (curr.status === 'ativo') dep.ativos += 1;
        dep.custoTotal += curr.salario;
      } else {
        acc.push({
          nome: curr.departamento,
          total: 1,
          ativos: curr.status === 'ativo' ? 1 : 0,
          custoTotal: curr.salario
        });
      }
      
      return acc;
    }, [] as FuncionarioStats['departamentos']);
    
    // Agrupar por cargo
    const cargos = funcionarios.reduce((acc, curr) => {
      const cargo = acc.find(c => c.nome === curr.cargo);
      
      if (cargo) {
        cargo.total += 1;
        cargo.custoMedio = (cargo.custoMedio * (cargo.total - 1) + curr.salario) / cargo.total;
      } else {
        acc.push({
          nome: curr.cargo,
          total: 1,
          custoMedio: curr.salario
        });
      }
      
      return acc;
    }, [] as FuncionarioStats['cargos']);
    
    return {
      totalFuncionarios: funcionarios.length,
      totalAtivos,
      totalInativos,
      totalFerias,
      totalLicenca,
      custoTotal,
      departamentos,
      cargos,
      historicoContratacoes: gerarHistoricoContratacoes(),
      distribuicaoSalarial: gerarDistribuicaoSalarial(funcionarios)
    };
  };

  // Handler para atualizar o filtro de departamento
  const handleChangeDepartment = (event: SelectChangeEvent) => {
    setDepartamentoFiltro(event.target.value);
  };

  // Handler para aplicar os filtros
  const handleApplyFilters = () => {
    setLoading(true);
    // Aqui entraria a lógica de busca dos dados com os filtros
    // Por enquanto simulamos um delay
    setTimeout(() => {
      setStats(processarDados(mockFuncionarios));
      setLoading(false);
    }, 800);
  };

  // Manipulador para exportar estatísticas
  const handleExportarEstatisticas = () => {
    // Implementação futura
    alert(t('funcionarios.estatisticas.funcionalidadeEmDesenvolvimento'));
  };

  // Carregar dados
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Usando dados mock para desenvolvimento
        setStats(processarDados(mockFuncionarios));
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Componente de loading
  if (loading || !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Cabeçalho da página */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.primary,
            mb: 1
          }}
        >
          {t('funcionarios.estatisticas.titulo')}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {format(new Date(), 'dd/MM/yyyy')} • {stats.totalFuncionarios} funcionários
        </Typography>
        <Divider />
      </Box>
      
      {/* Componente de filtro */}
      <PeriodFilter
        startDate={periodoInicio}
        endDate={periodoFim}
        departmentFilter={departamentoFiltro}
        departments={stats.departamentos.map(dep => dep.nome)}
        onStartDateChange={setPeriodoInicio}
        onEndDateChange={setPeriodoFim}
        onDepartmentChange={handleChangeDepartment}
        onFilterApply={handleApplyFilters}
      />

      {/* Estatísticas e Gráficos */}
      <Grid container spacing={3}>
        {/* Status dos Funcionários */}
        <Grid item xs={12} md={6}>
          <StatisticsCard
            title={t('funcionarios.estatisticas.statusFuncionarios')}
            icon={<StatusIcon />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: t('funcionarios.estatisticas.ativo') || 'Ativo', value: stats.totalAtivos },
                    { name: t('funcionarios.estatisticas.inativo') || 'Inativo', value: stats.totalInativos },
                    { name: t('funcionarios.estatisticas.ferias') || 'Férias', value: stats.totalFerias },
                    { name: t('funcionarios.estatisticas.licenca') || 'Licença', value: stats.totalLicenca }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 55 : 70}
                  outerRadius={isMobile ? 75 : 90}
                  paddingAngle={3}
                  cornerRadius={6}
                  dataKey="value"
                >
                  {[
                    { name: t('funcionarios.estatisticas.ativo') || 'Ativo', value: stats.totalAtivos },
                    { name: t('funcionarios.estatisticas.inativo') || 'Inativo', value: stats.totalInativos },
                    { name: t('funcionarios.estatisticas.ferias') || 'Férias', value: stats.totalFerias },
                    { name: t('funcionarios.estatisticas.licenca') || 'Licença', value: stats.totalLicenca }
                  ].map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={statusColors[index % statusColors.length]} 
                      stroke={theme.palette.background.paper}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={
                    <CustomTooltip 
                      title={t('funcionarios.estatisticas.statusFuncionarios') || 'Status dos Funcionários'}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legenda personalizada sob o gráfico */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexWrap: 'wrap', 
                gap: 2, 
                mt: 1 
              }}
            >
              {[
                { name: t('funcionarios.estatisticas.ativo') || 'Ativo', value: stats.totalAtivos, color: statusColors[0] },
                { name: t('funcionarios.estatisticas.inativo') || 'Inativo', value: stats.totalInativos, color: statusColors[1] },
                { name: t('funcionarios.estatisticas.ferias') || 'Férias', value: stats.totalFerias, color: statusColors[2] },
                { name: t('funcionarios.estatisticas.licenca') || 'Licença', value: stats.totalLicenca, color: statusColors[3] }
              ].map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mr: 2 
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: 1,
                      bgcolor: item.color,
                      mr: 1
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {item.name}: {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </StatisticsCard>
        </Grid>
        
        {/* Funcionários por Departamento */}
        <Grid item xs={12} md={6}>
          <StatisticsCard
            title={t('funcionarios.estatisticas.funcionariosPorDepartamento')}
            icon={<DepartmentIcon />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.departamentos}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barSize={isMobile ? 15 : 20}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke={theme.palette.divider}
                />
                <XAxis 
                  dataKey="nome" 
                  tickLine={false}
                  axisLine={{ stroke: theme.palette.divider }}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={{ stroke: theme.palette.divider }}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
                <RechartsTooltip
                  content={
                    <CustomTooltip 
                      title={t('funcionarios.estatisticas.funcionariosPorDepartamento') || 'Funcionários por Departamento'} 
                    />
                  }
                />
                <Bar 
                  dataKey="total" 
                  name={t('funcionarios.estatisticas.total') || 'Total'} 
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="ativos" 
                  name={t('funcionarios.estatisticas.ativos') || 'Ativos'} 
                  fill={theme.palette.success.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </StatisticsCard>
        </Grid>
        
        {/* Histórico de Contratações */}
        <Grid item xs={12} md={8}>
          <StatisticsCard
            title={t('funcionarios.estatisticas.historicoContratacoes')}
            icon={<TrendingIcon />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.historicoContratacoes}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorContratacoes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorDesligamentos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false}
                  stroke={theme.palette.divider}
                />
                <XAxis 
                  dataKey="mes" 
                  tickLine={false}
                  axisLine={{ stroke: theme.palette.divider }}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={{ stroke: theme.palette.divider }}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
                <RechartsTooltip
                  content={
                    <CustomTooltip 
                      title={t('funcionarios.estatisticas.historicoContratacoes') || 'Histórico de Contratações'}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="contratacoes"
                  name={t('funcionarios.estatisticas.contratacoes') || 'Contratações'}
                  stroke={theme.palette.primary.main}
                  fillOpacity={1}
                  fill="url(#colorContratacoes)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="desligamentos"
                  name={t('funcionarios.estatisticas.desligamentos') || 'Desligamentos'}
                  stroke={theme.palette.error.main}
                  fillOpacity={1}
                  fill="url(#colorDesligamentos)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </StatisticsCard>
        </Grid>
        
        {/* Distribuição Salarial */}
        <Grid item xs={12} md={4}>
          <StatisticsCard
            title={t('funcionarios.estatisticas.distribuicaoSalarial')}
            icon={<EuroIcon />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.distribuicaoSalarial}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                barSize={isMobile ? 15 : 20}
              >
                <CartesianGrid 
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke={theme.palette.divider}
                />
                <XAxis 
                  type="number"
                  tickLine={false}
                  axisLine={{ stroke: theme.palette.divider }}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
                <YAxis 
                  dataKey="faixa" 
                  type="category"
                  tickLine={false}
                  axisLine={{ stroke: theme.palette.divider }}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
                <RechartsTooltip
                  content={
                    <CustomTooltip 
                      title={t('funcionarios.estatisticas.faixaSalarial') || 'Faixa Salarial'}
                    />
                  }
                />
                <Bar 
                  dataKey="quantidade" 
                  name={t('funcionarios.estatisticas.quantidade') || 'Quantidade'} 
                  fill={theme.palette.success.main}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </StatisticsCard>
        </Grid>
        
        {/* Botão de Exportar */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleExportarEstatisticas}
              sx={{ 
                borderRadius: '8px',
                py: 1,
                px: 3,
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              {t('funcionarios.estatisticas.exportarEstatisticas')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticsPage; 