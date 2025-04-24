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
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  BarChart as ChartIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

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

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('funcionarios')}
      </Typography>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab icon={<PersonIcon />} label={t('funcionarios')} />
          <Tab icon={<ChartIcon />} label={t('estatisticas')} />
          <Tab icon={<AssignmentIcon />} label={t('folhaPagamento')} />
          <Tab icon={<CalendarIcon />} label={t('pontosFerias')} />
        </Tabs>

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
          <Typography variant="h6" gutterBottom>
            {t('estatisticas')}
          </Typography>
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography color="textSecondary">
              {t('funcionalidadeEmDesenvolvimento')}
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            {t('folhaPagamento')}
          </Typography>
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography color="textSecondary">
              {t('funcionalidadeEmDesenvolvimento')}
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            {t('pontosFerias')}
          </Typography>
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography color="textSecondary">
              {t('funcionalidadeEmDesenvolvimento')}
            </Typography>
          </Box>
        </TabPanel>
      </Paper>

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