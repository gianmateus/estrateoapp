import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Chip,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  BarChart as ChartIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as AccessTimeIcon,
  WorkOutline as WorkIcon,
  Money as MoneyIcon,
  Star as StarIcon,
  Print as PrintIcon,
  FilterList as FilterListIcon,
  GetApp as DownloadIcon,
  Download as ExportIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// Importar o componente de folha de pagamento
import PayrollPage from './employees/payroll/PayrollPage';
// Importar o componente de tempo e férias
import TimeVacationsPage from './employees/time-vacations/TimeVacationsPage';
// Importar componentes de visão geral e estatísticas
import OverviewPage from './employees/overview/OverviewPage';
import StatisticsPage from './employees/statistics/StatisticsPage';

// Interface para representar um funcionário
interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  dataContratacao: string; // formato ISO 8601
  salario: number;
  status: 'ativo' | 'inativo' | 'ferias' | 'licenca';
  documento: string;
  telefone: string;
  email: string;
  endereco: string;
}

// Interface para a interface TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Componente TabPanel para exibir o conteúdo das abas
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Componente principal de Funcionários
const Funcionarios = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState<Funcionario | null>(null);
  const [periodoEstatisticas, setPeriodoEstatisticas] = useState(new Date().getMonth() + '/' + new Date().getFullYear());
  const [mesAnoFiltro, setMesAnoFiltro] = useState(`${new Date().getMonth() + 1}/${new Date().getFullYear()}`);
  
  // Extrair a tab da query string na inicialização
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setTabValue(parseInt(tabParam, 10));
    }
  }, [location.search]);

  // Mock de dados para desenvolvimento
  const mockFuncionarios: Funcionario[] = [
    {
      id: '1',
      nome: 'Maria Silva',
      cargo: 'Gerente',
      departamento: 'Administrativo',
      dataContratacao: '2021-03-15',
      salario: 4500,
      status: 'ativo',
      documento: '123.456.789-00',
      telefone: '(11) 98765-4321',
      email: 'maria.silva@empresa.com',
      endereco: 'Rua das Flores, 123'
    },
    {
      id: '2',
      nome: 'João Santos',
      cargo: 'Chef de Cozinha',
      departamento: 'Cozinha',
      dataContratacao: '2020-05-10',
      salario: 3800,
      status: 'ativo',
      documento: '987.654.321-00',
      telefone: '(11) 91234-5678',
      email: 'joao.santos@empresa.com',
      endereco: 'Av. Principal, 456'
    },
    {
      id: '3',
      nome: 'Ana Oliveira',
      cargo: 'Atendente',
      departamento: 'Atendimento',
      dataContratacao: '2022-01-20',
      salario: 2200,
      status: 'ferias',
      documento: '456.789.123-00',
      telefone: '(11) 94567-8901',
      email: 'ana.oliveira@empresa.com',
      endereco: 'Rua Secundária, 789'
    },
    {
      id: '4',
      nome: 'Pedro Costa',
      cargo: 'Auxiliar de Cozinha',
      departamento: 'Cozinha',
      dataContratacao: '2021-11-05',
      salario: 1800,
      status: 'ativo',
      documento: '789.123.456-00',
      telefone: '(11) 95678-9012',
      email: 'pedro.costa@empresa.com',
      endereco: 'Av. Central, 101'
    },
    {
      id: '5',
      nome: 'Juliana Pereira',
      cargo: 'Recepcionista',
      departamento: 'Atendimento',
      dataContratacao: '2022-03-01',
      salario: 2000,
      status: 'licenca',
      documento: '321.654.987-00',
      telefone: '(11) 96789-0123',
      email: 'juliana.pereira@empresa.com',
      endereco: 'Rua Nova, 202'
    }
  ];

  // Dados para os gráficos (mock data)
  const dadosHorasPorFuncionario = [
    { nome: 'Maria Silva', horas: 176 },
    { nome: 'João Santos', horas: 168 },
    { nome: 'Ana Oliveira', horas: 140 },
    { nome: 'Pedro Costa', horas: 180 },
    { nome: 'Juliana Pereira', horas: 156 },
  ].sort((a, b) => a.horas - b.horas);

  const dadosCustoPorFuncionario = [
    { nome: 'Maria Silva', custo: 4500 },
    { nome: 'João Santos', custo: 3800 },
    { nome: 'Ana Oliveira', custo: 2200 },
    { nome: 'Pedro Costa', custo: 1800 },
    { nome: 'Juliana Pereira', custo: 2000 },
  ];

  const dadosHorasExtrasRegulares = [
    { name: t('horasRegulares'), value: 820 },
    { name: t('horasExtras'), value: 125 },
  ];

  const CORES_GRAFICO_PIZZA = ['#0088FE', '#FF8042'];

  // Calcular KPIs
  const funcionariosAtivos = mockFuncionarios.filter(f => f.status === 'ativo').length;
  const totalHorasTrabalhadas = dadosHorasPorFuncionario.reduce((sum, item) => sum + item.horas, 0);
  const custoTotalFuncionarios = dadosCustoPorFuncionario.reduce((sum, item) => sum + item.custo, 0);
  const funcionarioMaisHoras = dadosHorasPorFuncionario.reduce((prev, current) => 
    (prev.horas > current.horas) ? prev : current, { nome: '', horas: 0 });

  // Renderizador customizado para tooltip do gráfico de pizza
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Manipulador para exportar estatísticas
  const handleExportarEstatisticas = () => {
    alert(t('funcionalidadeEmDesenvolvimento'));
    // Aqui seria implementada a exportação para PDF/Excel
  };

  // Buscar dados
  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 800));
        setFuncionarios(mockFuncionarios);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDados();
  }, []);

  // Manipulador para mudança de aba
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Atualizar a URL para refletir a tab selecionada sem recarregar a página
    navigate(`/dashboard/funcionarios${newValue > 0 ? `?tab=${newValue}` : ''}`, { replace: true });
  };

  // Manipulador para abrir modal de novo funcionário
  const handleNovoFuncionario = () => {
    setFuncionarioEditando(null);
    setModalAberto(true);
  };

  // Manipulador para editar funcionário
  const handleEditarFuncionario = (funcionario: Funcionario) => {
    setFuncionarioEditando(funcionario);
    setModalAberto(true);
  };

  // Manipulador para fechar modal
  const handleFecharModal = () => {
    setModalAberto(false);
    setFuncionarioEditando(null);
  };

  // Manipulador para salvar funcionário
  const handleSalvarFuncionario = () => {
    alert(t('funcionarioSalvoComSucesso'));
    setModalAberto(false);
    setFuncionarioEditando(null);
  };

  // Manipulador para excluir funcionário
  const handleExcluirFuncionario = (id: string) => {
    if (window.confirm(String(t('confirmarExclusao')))) {
      // Aqui seria implementada a exclusão do funcionário
      alert(t('funcionarioExcluidoComSucesso'));
    }
  };

  // Formato de moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  // Formato de data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // Renderização de status
  const renderizarStatus = (status: 'ativo' | 'inativo' | 'ferias' | 'licenca') => {
    let color: 'success' | 'error' | 'primary' | 'warning' = 'success';
    let label = t('ativo');
    
    switch (status) {
      case 'ativo':
        color = 'success';
        label = t('ativo');
        break;
      case 'inativo':
        color = 'error';
        label = t('inativo');
        break;
      case 'ferias':
        color = 'primary';
        label = t('ferias');
        break;
      case 'licenca':
        color = 'warning';
        label = t('licenca');
        break;
    }

    return <Chip label={label} color={color} size="small" />;
  };

  // Manipulador para mudança de filtro mês/ano
  const handleMudancaFiltroMesAno = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMesAnoFiltro(event.target.value);
  };

  // Manipulador para navegação para a página de Time & Vacations
  const handleNavigateToTimeVacations = () => {
    navigate('/dashboard/funcionarios/time-vacations');
  };

  // Renderizar as abas e seus conteúdos
  const renderizarAbas = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            aria-label="tabs funcionários"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={t('visaoGeral')} icon={<PersonIcon />} iconPosition="start" />
            <Tab label={t('estatisticas')} icon={<ChartIcon />} iconPosition="start" />
            <Tab label={t('folhaPagamento')} icon={<MoneyIcon />} iconPosition="start" />
            <Tab 
              label={t('tempoFerias')} 
              icon={<AccessTimeIcon />} 
              iconPosition="start"
              onClick={(e) => {
                e.preventDefault();
                handleNavigateToTimeVacations();
              }}
            />
          </Tabs>
        </Box>

        {/* Conteúdo da aba Visão Geral */}
        <TabPanel value={tabValue} index={0}>
          {tabValue === 0 && (
            <OverviewPage />
          )}
        </TabPanel>

        {/* Conteúdo da aba Estatísticas */}
        <TabPanel value={tabValue} index={1}>
          {tabValue === 1 && (
            <StatisticsPage />
          )}
        </TabPanel>

        {/* Conteúdo da aba Folha de Pagamento */}
        <TabPanel value={tabValue} index={2}>
          <PayrollPage />
        </TabPanel>

        {/* A aba de Tempo e Férias redireciona para a página separada */}
        <TabPanel value={tabValue} index={3}>
          {/* Conteúdo não será exibido pois redirecionamos na aba */}
        </TabPanel>
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {t('funcionarios')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNovoFuncionario}
        >
          {t('novoFuncionario')}
        </Button>
      </Box>

      {renderizarAbas()}

      {/* Modal para adicionar/editar funcionário */}
      <Dialog open={modalAberto} onClose={handleFecharModal} maxWidth="md" fullWidth>
        <DialogTitle>
          {funcionarioEditando ? t('editarFuncionario') : t('novoFuncionario')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('nome')}
                fullWidth
                defaultValue={funcionarioEditando?.nome || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('email')}
                type="email"
                fullWidth
                defaultValue={funcionarioEditando?.email || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('documento')}
                fullWidth
                defaultValue={funcionarioEditando?.documento || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('telefone')}
                fullWidth
                defaultValue={funcionarioEditando?.telefone || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('endereco')}
                fullWidth
                defaultValue={funcionarioEditando?.endereco || ''}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label={t('cargo')}
                fullWidth
                defaultValue={funcionarioEditando?.cargo || ''}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label={t('departamento')}
                fullWidth
                defaultValue={funcionarioEditando?.departamento || ''}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>{t('status')}</InputLabel>
                <Select
                  defaultValue={funcionarioEditando?.status || 'ativo'}
                  label={t('status')}
                >
                  <MenuItem value="ativo">{t('ativo')}</MenuItem>
                  <MenuItem value="inativo">{t('inativo')}</MenuItem>
                  <MenuItem value="ferias">{t('ferias')}</MenuItem>
                  <MenuItem value="licenca">{t('licenca')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('dataContratacao')}
                type="date"
                fullWidth
                defaultValue={funcionarioEditando?.dataContratacao || new Date().toISOString().split('T')[0]}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('salario')}
                type="number"
                fullWidth
                defaultValue={funcionarioEditando?.salario || ''}
                InputProps={{
                  startAdornment: <Box component="span" sx={{ mr: 1 }}>R$</Box>
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharModal}>{t('cancelar')}</Button>
          <Button onClick={handleSalvarFuncionario} variant="contained" color="primary">
            {t('salvar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Funcionarios; 