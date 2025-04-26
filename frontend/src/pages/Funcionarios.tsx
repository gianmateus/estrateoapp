import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
        console.error('Erro ao buscar dados de funcionários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  // Manipulador de mudança de aba
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Manipulador para abrir modal de novo funcionário
  const handleNovoFuncionario = () => {
    setFuncionarioEditando(null);
    setModalAberto(true);
  };

  // Manipulador para abrir modal de edição
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
    // Aqui seria implementada a lógica para salvar ou atualizar
    // o funcionário no backend
    handleFecharModal();
  };

  // Manipulador para excluir funcionário
  const handleExcluirFuncionario = (id: string) => {
    if (window.confirm(t('confirmarExclusaoFuncionario'))) {
      // Lógica para excluir funcionário
      setFuncionarios(funcionarios.filter(f => f.id !== id));
    }
  };

  // Formatação de moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Formatação de data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // Filtragem de funcionários
  const funcionariosFiltrados = funcionarios.filter(f => {
    return (
      (filtroNome === '' || f.nome.toLowerCase().includes(filtroNome.toLowerCase())) &&
      (filtroDepartamento === '' || f.departamento === filtroDepartamento) &&
      (filtroStatus === '' || f.status === filtroStatus)
    );
  });

  // Obter lista única de departamentos para o filtro
  const departamentos = [...new Set(funcionarios.map(f => f.departamento))];

  // Renderização do chip de status
  const renderizarStatus = (status: 'ativo' | 'inativo' | 'ferias' | 'licenca') => {
    let color: 'success' | 'error' | 'warning' | 'info' = 'success';
    let label = '';

    switch(status) {
      case 'ativo':
        color = 'success';
        label = t('ativo');
        break;
      case 'inativo':
        color = 'error';
        label = t('inativo');
        break;
      case 'ferias':
        color = 'info';
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={t('lista')} icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label={t('estatisticas')} icon={<ChartIcon />} iconPosition="start" />
          <Tab label={t('folhaPagamento')} icon={<MoneyIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
            <TextField
              label={t('buscar')}
              variant="outlined"
              size="small"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon />
              }}
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>{t('departamento')}</InputLabel>
              <Select
                value={filtroDepartamento}
                onChange={(e) => setFiltroDepartamento(e.target.value)}
                label={t('departamento')}
              >
                <MenuItem value="">{t('todos')}</MenuItem>
                {departamentos.map(dep => (
                  <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>{t('status')}</InputLabel>
              <Select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                label={t('status')}
              >
                <MenuItem value="">{t('todos')}</MenuItem>
                <MenuItem value="ativo">{t('ativo')}</MenuItem>
                <MenuItem value="inativo">{t('inativo')}</MenuItem>
                <MenuItem value="ferias">{t('ferias')}</MenuItem>
                <MenuItem value="licenca">{t('licenca')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNovoFuncionario}
          >
            {t('novoFuncionario')}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('nome')}</TableCell>
                  <TableCell>{t('cargo')}</TableCell>
                  <TableCell>{t('departamento')}</TableCell>
                  <TableCell>{t('dataContratacao')}</TableCell>
                  <TableCell>{t('salario')}</TableCell>
                  <TableCell>{t('status')}</TableCell>
                  <TableCell align="center">{t('acoes')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {funcionariosFiltrados.map((funcionario) => (
                  <TableRow key={funcionario.id}>
                    <TableCell>{funcionario.nome}</TableCell>
                    <TableCell>{funcionario.cargo}</TableCell>
                    <TableCell>{funcionario.departamento}</TableCell>
                    <TableCell>{formatarData(funcionario.dataContratacao)}</TableCell>
                    <TableCell>{formatarMoeda(funcionario.salario)}</TableCell>
                    <TableCell>{renderizarStatus(funcionario.status)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('editar')}>
                        <IconButton onClick={() => handleEditarFuncionario(funcionario)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('excluir')}>
                        <IconButton color="error" onClick={() => handleExcluirFuncionario(funcionario.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box>
          {/* Filtros para estatísticas */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label={t('periodo')}
                variant="outlined"
                size="small"
                value={mesAnoFiltro}
                onChange={handleMudancaFiltroMesAno}
                sx={{ width: 120 }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setPeriodoEstatisticas(mesAnoFiltro)}
              >
                {t('filtrar')}
              </Button>
            </Box>
            <Box>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={handleExportarEstatisticas}
                sx={{ mr: 1 }}
              >
                {t('exportar')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handleExportarEstatisticas}
              >
                {t('imprimir')}
              </Button>
            </Box>
          </Box>

          {/* KPIs */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('funcionariosAtivos')}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {funcionariosAtivos}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <PersonIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                    {t('totalFuncionarios')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('horasTrabalhadasMes')}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {totalHorasTrabalhadas}h
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                    {periodoEstatisticas}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('custoTotalFuncionarios')}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatarMoeda(custoTotalFuncionarios)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <MoneyIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                    {periodoEstatisticas}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {t('funcionarioMaisHoras')}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {funcionarioMaisHoras.horas}h
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <StarIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                    {funcionarioMaisHoras.nome}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Gráficos */}
          <Grid container spacing={3}>
            {/* Gráfico de Horas por Funcionário */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {t('horasPorFuncionario')}
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={dadosHorasPorFuncionario}
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="nome" 
                        type="category"
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip />
                      <Bar dataKey="horas" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Gráfico de Custo por Funcionário */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {t('custoPorFuncionario')}
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dadosCustoPorFuncionario}
                      margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="nome"
                        tick={(props) => {
                          const { x, y, payload } = props;
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text 
                                x={0} 
                                y={0} 
                                dy={16} 
                                textAnchor="end" 
                                fill="#666"
                                fontSize={12}
                                transform="rotate(-45)"
                              >
                                {payload.value}
                              </text>
                            </g>
                          );
                        }}
                        height={70}
                      />
                      <YAxis />
                      <ChartTooltip formatter={(value) => formatarMoeda(Number(value))} />
                      <Bar dataKey="custo" fill={theme.palette.secondary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Gráfico de Horas Extras vs Regulares */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('horasExtrasVsRegulares')}
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosHorasExtrasRegulares}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosHorasExtrasRegulares.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_GRAFICO_PIZZA[index % CORES_GRAFICO_PIZZA.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <PayrollPage />
      </TabPanel>

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