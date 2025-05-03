import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  FilterList as FilterIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

// Interface para os dados do funcionário no relatório
interface FuncionarioRelatorio {
  id: string;
  nome: string;
  cargo: string;
  tipoContrato: string;
  dataAdmissao: string;
  situacaoAtual: string;
  formaPagamento: string;
  salarioBruto: number;
  telefone?: string;
  email?: string;
}

const FuncionariosReport: React.FC = () => {
  const { t } = useTranslation();
  const [funcionarios, setFuncionarios] = useState<FuncionarioRelatorio[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroCargo, setFiltroCargo] = useState('');
  const [filtroFormaPagamento, setFiltroFormaPagamento] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState('');
  const [cargos, setCargos] = useState<string[]>([]);

  // Buscar dados dos funcionários
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get<FuncionarioRelatorio[]>('/funcionarios');
        const dadosFuncionarios = response.data;
        setFuncionarios(dadosFuncionarios);
        
        // Extrair cargos únicos para o filtro
        const cargosList = [...new Set(dadosFuncionarios.map((f: FuncionarioRelatorio) => f.cargo))];
        setCargos(cargosList as string[]);
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        
        // Dados mockados para desenvolvimento
        const mockData: FuncionarioRelatorio[] = [
          {
            id: '1',
            nome: 'Maria Silva',
            cargo: 'Gerente',
            tipoContrato: 'Vollzeit',
            dataAdmissao: '2021-03-15',
            situacaoAtual: 'ativo',
            formaPagamento: 'mensal',
            salarioBruto: 4500,
            telefone: '(11) 98765-4321',
            email: 'maria@exemplo.com'
          },
          {
            id: '2',
            nome: 'João Santos',
            cargo: 'Atendente',
            tipoContrato: 'Teilzeit',
            dataAdmissao: '2022-04-10',
            situacaoAtual: 'ferias',
            formaPagamento: 'hora',
            salarioBruto: 2500,
            telefone: '(11) 91234-5678',
            email: 'joao@exemplo.com'
          },
          {
            id: '3',
            nome: 'Ana Oliveira',
            cargo: 'Cozinheiro',
            tipoContrato: 'Vollzeit',
            dataAdmissao: '2022-01-05',
            situacaoAtual: 'ativo',
            formaPagamento: 'mensal',
            salarioBruto: 3800,
            telefone: '(11) 94567-8901',
            email: 'ana@exemplo.com'
          },
          {
            id: '4',
            nome: 'Pedro Costa',
            cargo: 'Entregador',
            tipoContrato: 'Minijob',
            dataAdmissao: '2023-01-20',
            situacaoAtual: 'afastado',
            formaPagamento: 'hora',
            salarioBruto: 1500,
            telefone: '(11) 95678-9012',
            email: 'pedro@exemplo.com'
          }
        ];
        
        setFuncionarios(mockData);
        setCargos([...new Set(mockData.map(f => f.cargo))]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrar funcionários
  const funcionariosFiltrados = funcionarios.filter(funcionario => {
    return (
      (filtroCargo ? funcionario.cargo === filtroCargo : true) &&
      (filtroFormaPagamento ? funcionario.formaPagamento === filtroFormaPagamento : true) &&
      (filtroSituacao ? funcionario.situacaoAtual === filtroSituacao : true)
    );
  });

  // Formatar data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString();
  };

  // Formatar moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Renderizar chip de situação
  const renderizarSituacao = (situacao: string) => {
    let color: 'success' | 'info' | 'warning' | 'error' = 'success';
    let label = t('funcionario.ativo');
    
    switch (situacao) {
      case 'ativo':
        color = 'success';
        label = t('funcionario.ativo');
        break;
      case 'ferias':
        color = 'info';
        label = t('funcionario.ferias');
        break;
      case 'afastado':
        color = 'warning';
        label = t('funcionario.afastado');
        break;
      case 'desligado':
        color = 'error';
        label = t('funcionario.desligado');
        break;
    }
    
    return <Chip label={label} color={color} size="small" />;
  };

  // Gerar PDF
  const gerarPDF = async () => {
    try {
      // Aqui seria a lógica para gerar o PDF
      alert('Funcionalidade de geração de PDF será implementada');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('relatorioFuncionarios')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('funcionario.cargo')}</InputLabel>
                  <Select
                    value={filtroCargo}
                    onChange={(e) => setFiltroCargo(e.target.value)}
                    label={t('funcionario.cargo')}
                  >
                    <MenuItem value="">{t('todos')}</MenuItem>
                    {cargos.map((cargo) => (
                      <MenuItem key={cargo} value={cargo}>{cargo}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('funcionario.formaPagamento')}</InputLabel>
                  <Select
                    value={filtroFormaPagamento}
                    onChange={(e) => setFiltroFormaPagamento(e.target.value)}
                    label={t('funcionario.formaPagamento')}
                  >
                    <MenuItem value="">{t('todos')}</MenuItem>
                    <MenuItem value="mensal">{t('funcionario.mensal')}</MenuItem>
                    <MenuItem value="hora">{t('funcionario.hora')}</MenuItem>
                    <MenuItem value="comissao">{t('funcionario.comissao')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('funcionario.situacaoAtual')}</InputLabel>
                  <Select
                    value={filtroSituacao}
                    onChange={(e) => setFiltroSituacao(e.target.value)}
                    label={t('funcionario.situacaoAtual')}
                  >
                    <MenuItem value="">{t('todos')}</MenuItem>
                    <MenuItem value="ativo">{t('funcionario.ativo')}</MenuItem>
                    <MenuItem value="ferias">{t('funcionario.ferias')}</MenuItem>
                    <MenuItem value="afastado">{t('funcionario.afastado')}</MenuItem>
                    <MenuItem value="desligado">{t('funcionario.desligado')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => {
                      setFiltroCargo('');
                      setFiltroFormaPagamento('');
                      setFiltroSituacao('');
                    }}
                  >
                    {t('limparFiltros')}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PrintIcon />}
                    onClick={gerarPDF}
                  >
                    {t('exportarPDF')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('nome')}</TableCell>
                    <TableCell>{t('funcionario.cargo')}</TableCell>
                    <TableCell>{t('funcionario.dataAdmissao')}</TableCell>
                    <TableCell>{t('tipoContrato')}</TableCell>
                    <TableCell>{t('funcionario.formaPagamento')}</TableCell>
                    <TableCell>{t('funcionario.situacaoAtual')}</TableCell>
                    <TableCell align="right">{t('salarioBruto')}</TableCell>
                    <TableCell>{t('funcionario.contato')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {funcionariosFiltrados.length > 0 ? (
                    funcionariosFiltrados.map((funcionario) => (
                      <TableRow key={funcionario.id}>
                        <TableCell>{funcionario.nome}</TableCell>
                        <TableCell>{funcionario.cargo}</TableCell>
                        <TableCell>{formatarData(funcionario.dataAdmissao)}</TableCell>
                        <TableCell>{funcionario.tipoContrato}</TableCell>
                        <TableCell>{t(`funcionario.${funcionario.formaPagamento}`)}</TableCell>
                        <TableCell>{renderizarSituacao(funcionario.situacaoAtual)}</TableCell>
                        <TableCell align="right">{formatarMoeda(funcionario.salarioBruto)}</TableCell>
                        <TableCell>
                          {funcionario.telefone && (
                            <Typography variant="body2" color="text.secondary">
                              {funcionario.telefone}
                            </Typography>
                          )}
                          {funcionario.email && (
                            <Typography variant="body2" color="text.secondary">
                              {funcionario.email}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {t('nenhumFuncionarioEncontrado')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
        
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={gerarPDF}
            >
              {t('exportarRelatorio')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FuncionariosReport; 