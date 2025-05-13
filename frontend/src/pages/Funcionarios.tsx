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
import FuncionarioForm from '../components/funcionarios/FuncionarioForm';
import type { Funcionario } from '../components/funcionarios/FuncionarioForm';

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
      const tabIndex = parseInt(tabParam, 10);
      setTabValue(tabIndex);
      
      // Garantir que quaisquer animações e estados específicos de tab sejam aplicados corretamente
      // Isso garantirá uma transição suave mesmo se o usuário acessar diretamente por URL
    }
  }, [location.search]);

  // Mock de dados para desenvolvimento
  const mockFuncionarios: Funcionario[] = [
    {
      id: '1',
      nomeCompleto: 'Maria Silva',
      cargo: 'Gerente',
      departamento: 'Administrativo',
      emailProfissional: 'maria.silva@empresa.com',
      telefone: '(11) 98765-4321',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      cep: '01234-567',
      pais: 'Alemanha',
      nacionalidade: 'Brasileira',
      idiomas: ['Português', 'Alemão', 'Inglês'],
      dataAdmissao: new Date('2021-03-15'),
      tipoContrato: 'Vollzeit',
      jornadaSemanal: 40,
      diasTrabalho: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      salarioBruto: 4500,
      status: 'ativo'
    },
    {
      id: '2',
      nomeCompleto: 'João Santos',
      cargo: 'Chef de Cozinha',
      departamento: 'Cozinha',
      emailProfissional: 'joao.santos@empresa.com',
      telefone: '(11) 91234-5678',
      endereco: 'Av. Principal, 456',
      cidade: 'São Paulo',
      cep: '04567-890',
      pais: 'Alemanha',
      nacionalidade: 'Brasileira',
      idiomas: ['Português', 'Alemão'],
      dataAdmissao: new Date('2020-05-10'),
      tipoContrato: 'Vollzeit',
      jornadaSemanal: 40,
      diasTrabalho: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      salarioBruto: 3800,
      status: 'ativo'
    },
    {
      id: '3',
      nomeCompleto: 'Ana Oliveira',
      cargo: 'Atendente',
      departamento: 'Atendimento',
      emailProfissional: 'ana.oliveira@empresa.com',
      telefone: '(11) 94567-8901',
      endereco: 'Rua Secundária, 789',
      cidade: 'São Paulo',
      cep: '07890-123',
      pais: 'Alemanha',
      nacionalidade: 'Brasileira',
      idiomas: ['Português', 'Alemão', 'Inglês'],
      dataAdmissao: new Date('2022-01-20'),
      tipoContrato: 'Teilzeit',
      jornadaSemanal: 30,
      diasTrabalho: ['Segunda', 'Terça', 'Quarta', 'Quinta'],
      salarioBruto: 2200,
      status: 'inativo'
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
  const handleSalvarFuncionario = (dados: any) => {
    // Aqui você pode fazer a chamada para salvar no backend
    // Exemplo: await api.post('/funcionarios', dados);
    setModalAberto(false);
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
  const renderizarStatus = (status: string) => {
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
    }

    return <Chip label={label} color={color} size="small" />;
  };

  // Manipulador para mudança de filtro mês/ano
  const handleMudancaFiltroMesAno = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMesAnoFiltro(event.target.value);
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
            <Tab label={t('tempoFerias')} icon={<AccessTimeIcon />} iconPosition="start" />
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

        {/* Conteúdo da aba Tempo e Férias */}
        <TabPanel value={tabValue} index={3}>
          {tabValue === 3 && (
            <TimeVacationsPage />
          )}
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
          <FuncionarioForm
            funcionario={funcionarioEditando || undefined}
            onSubmit={handleSalvarFuncionario}
            isLoading={loading}
          />
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