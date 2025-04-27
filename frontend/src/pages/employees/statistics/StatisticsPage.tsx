import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Download as DownloadIcon,
  BarChart as ChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  FilterList as FilterIcon,
  PaidOutlined as PaidIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';

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

const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FuncionarioStats | null>(null);
  const [periodoInicio, setPeriodoInicio] = useState<Date | null>(
    new Date(new Date().getFullYear(), 0, 1) // 1º de janeiro do ano atual
  );
  const [periodoFim, setPeriodoFim] = useState<Date | null>(new Date());
  const [departamentoFiltro, setDepartamentoFiltro] = useState<string>('todos');
  
  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
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
      '1000-2000',
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

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  // Renderizador customizado para tooltip do gráfico de pizza
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // Manipulador para exportar estatísticas
  const handleExportarEstatisticas = () => {
    alert(t('funcionalidadeEmDesenvolvimento'));
    // Aqui seria implementada a exportação para PDF/Excel
  };
  
  if (loading || !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label={t('periodoInicio')}
                value={periodoInicio}
                onChange={setPeriodoInicio}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small'
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label={t('periodoFim')}
                value={periodoFim}
                onChange={setPeriodoFim}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small'
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="departamento-label">{t('departamento')}</InputLabel>
              <Select
                labelId="departamento-label"
                value={departamentoFiltro}
                onChange={(e) => setDepartamentoFiltro(e.target.value)}
                label={t('departamento')}
              >
                <MenuItem value="todos">{t('todos')}</MenuItem>
                {stats.departamentos.map(dep => (
                  <MenuItem key={dep.nome} value={dep.nome}>{dep.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              fullWidth
              size="medium"
            >
              {t('aplicar')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Estatísticas e Gráficos */}
      <Grid container spacing={3}>
        {/* Status dos Funcionários */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('statusFuncionarios')}
                </Typography>
                <PieChartIcon color="primary" />
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: String(t('ativo')), value: stats.totalAtivos },
                      { name: String(t('inativo')), value: stats.totalInativos },
                      { name: String(t('ferias')), value: stats.totalFerias },
                      { name: String(t('licenca')), value: stats.totalLicenca }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {
                      [
                        { name: String(t('ativo')), value: stats.totalAtivos },
                        { name: String(t('inativo')), value: stats.totalInativos },
                        { name: String(t('ferias')), value: stats.totalFerias },
                        { name: String(t('licenca')), value: stats.totalLicenca }
                      ].map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                  </Pie>
                  <ChartTooltip formatter={(value) => [value, String(t('funcionarios'))]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Funcionários por Departamento */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('funcionariosPorDepartamento')}
                </Typography>
                <ChartIcon color="primary" />
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.departamentos}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <ChartTooltip formatter={(value) => [value, String(t('funcionarios'))]} />
                  <Legend />
                  <Bar dataKey="total" name={String(t('total'))} fill="#8884d8" />
                  <Bar dataKey="ativos" name={String(t('ativos'))} fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Histórico de Contratações */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('historicoContratacoes')}
                </Typography>
                <LineChartIcon color="primary" />
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={stats.historicoContratacoes}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip formatter={(value) => [value, String(t('funcionarios'))]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="contratacoes"
                    name={String(t('contratacoes'))}
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="desligamentos"
                    name={String(t('desligamentos'))}
                    stroke="#ff7300"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Distribuição Salarial */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('distribuicaoSalarial')}
                </Typography>
                <PaidIcon color="primary" />
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.distribuicaoSalarial}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="faixa" type="category" />
                  <ChartTooltip formatter={(value) => [value, String(t('funcionarios'))]} />
                  <Legend />
                  <Bar dataKey="quantidade" name={String(t('quantidade'))} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Botão de Exportar */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleExportarEstatisticas}
            >
              {t('exportarEstatisticas')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticsPage; 