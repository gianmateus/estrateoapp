import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Paid as PaidIcon,
  Work as WorkIcon,
  AddCircle as AddCircleIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

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
  fotoPerfil?: string;
}

const OverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    ferias: 0,
    licenca: 0,
    contratadosRecentemente: 0
  });

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
      endereco: 'Rua das Flores, 123',
      fotoPerfil: 'https://randomuser.me/api/portraits/women/44.jpg'
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
      endereco: 'Av. Principal, 456',
      fotoPerfil: 'https://randomuser.me/api/portraits/men/32.jpg'
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
      endereco: 'Rua Secundária, 789',
      fotoPerfil: 'https://randomuser.me/api/portraits/women/63.jpg'
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
      endereco: 'Av. Central, 101',
      fotoPerfil: 'https://randomuser.me/api/portraits/men/15.jpg'
    },
    {
      id: '5',
      nome: 'Juliana Pereira',
      cargo: 'Recepcionista',
      departamento: 'Atendimento',
      dataContratacao: '2023-03-01',
      salario: 2000,
      status: 'licenca',
      documento: '321.654.987-00',
      telefone: '(11) 96789-0123',
      email: 'juliana.pereira@empresa.com',
      endereco: 'Rua Nova, 202',
      fotoPerfil: 'https://randomuser.me/api/portraits/women/22.jpg'
    }
  ];

  // Carregar dados
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Usando dados mock para desenvolvimento
        setFuncionarios(mockFuncionarios);
        
        // Calcular estatísticas
        const ativos = mockFuncionarios.filter(f => f.status === 'ativo').length;
        const inativos = mockFuncionarios.filter(f => f.status === 'inativo').length;
        const ferias = mockFuncionarios.filter(f => f.status === 'ferias').length;
        const licenca = mockFuncionarios.filter(f => f.status === 'licenca').length;
        
        // Calcular contratados nos últimos 3 meses
        const tresMesesAtras = new Date();
        tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
        const contratadosRecentemente = mockFuncionarios.filter(
          f => new Date(f.dataContratacao) >= tresMesesAtras
        ).length;
        
        setStats({
          total: mockFuncionarios.length,
          ativos,
          inativos,
          ferias,
          licenca,
          contratadosRecentemente
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  // Formatação de data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Chip de status
  const renderStatus = (status: string) => {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Cards de resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                {t('totalFuncionarios')}
              </Typography>
              <GroupIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats.total}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 'auto' }}>
              {stats.ativos} {t('ativos')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                {t('ausenciasAtivas')}
              </Typography>
              <EventIcon color="error" />
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats.ferias + stats.licenca}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 'auto' }}>
              {stats.ferias} {t('ferias')}, {stats.licenca} {t('licenca')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                {t('contratadosRecentemente')}
              </Typography>
              <AddCircleIcon color="success" />
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats.contratadosRecentemente}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 'auto' }}>
              {t('ultimosTresMeses')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                {t('custoMensalFolha')}
              </Typography>
              <PaidIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {formatCurrency(funcionarios.reduce((sum, f) => sum + f.salario, 0))}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 'auto' }}>
              {t('mediaFuncionario')}: {formatCurrency(funcionarios.reduce((sum, f) => sum + f.salario, 0) / stats.total)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de funcionários recentes */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{t('ultimosContratados')}</Typography>
          <Button size="small" variant="outlined">
            {t('verTodos')}
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="tabela de funcionários recentes">
            <TableHead>
              <TableRow>
                <TableCell>{t('nome')}</TableCell>
                <TableCell>{t('cargo')}</TableCell>
                <TableCell>{t('departamento')}</TableCell>
                <TableCell>{t('dataContratacao')}</TableCell>
                <TableCell>{t('salario')}</TableCell>
                <TableCell>{t('status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {funcionarios
                .sort((a, b) => new Date(b.dataContratacao).getTime() - new Date(a.dataContratacao).getTime())
                .slice(0, 3)
                .map((funcionario) => (
                  <TableRow key={funcionario.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={funcionario.fotoPerfil} 
                          alt={funcionario.nome} 
                          sx={{ mr: 2, width: 32, height: 32 }}
                        />
                        {funcionario.nome}
                      </Box>
                    </TableCell>
                    <TableCell>{funcionario.cargo}</TableCell>
                    <TableCell>{funcionario.departamento}</TableCell>
                    <TableCell>{formatDate(funcionario.dataContratacao)}</TableCell>
                    <TableCell>{formatCurrency(funcionario.salario)}</TableCell>
                    <TableCell>{renderStatus(funcionario.status)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Departamentos */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>{t('funcionariosPorDepartamento')}</Typography>
        <Grid container spacing={2}>
          {['Administrativo', 'Cozinha', 'Atendimento'].map(departamento => {
            const funcsDepartamento = funcionarios.filter(f => f.departamento === departamento);
            return (
              <Grid item xs={12} sm={4} key={departamento}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {departamento}
                    </Typography>
                    <Typography variant="h4">
                      {funcsDepartamento.length}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('ativosDepartamento')}:
                      </Typography>
                      <Typography variant="body2">
                        {funcsDepartamento.filter(f => f.status === 'ativo').length}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('custoMensal')}:
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(funcsDepartamento.reduce((sum, f) => sum + f.salario, 0))}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default OverviewPage; 