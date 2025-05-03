import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Divider,
  Chip,
  Tab,
  Tabs,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, BarChart as ChartIcon, Edit as EditIcon, Close as CloseIcon, FilterList as FilterListIcon, Clear as ClearIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import { ptBR, enUS, de } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useFinanceiro } from '../contexts/FinanceiroContext';
import { generateSecureId } from '../utils/security';
import { validateTextField, validateNumberField, validateDateField } from '../utils/validation';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import FormularioEntrada from '../components/financeiro/FormularioEntrada';
import FormularioSaida from '../components/financeiro/FormularioSaida';
import { EventBus } from '../services/EventBus';
import { Transacao, TipoEntrada, StatusRecebimento, TipoDespesa, FormaPagamento } from '../contexts/FinanceiroContext';

interface PagamentoProgramado {
  id: string;
  descricao: string;
  valor: number;
  dataVencimento: Date;
  pago: boolean;
  recorrencia?: 'quinzenal' | 'mensal' | 'trimestral' | 'nenhuma';
}

const categoriasSaida = ['Salário', 'Compras', 'Pagamentos'];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`financeiro-tabpanel-${index}`}
      aria-labelledby={`financeiro-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Adicionar uma interface FormData que inclui todos os campos usados no componente, incluindo os novos campos
interface FormData {
  valor: string;
  data: string;
  descricao: string;
  categoria: string;
  observacao: string;
  recorrencia: string;
  // Campos de parcelamento
  parcelamento?: {
    habilitado: boolean;
    quantidadeParcelas: number;
    parcelas: Array<{
      numero: number;
      valorParcela: number;
      dataPrevista: string;
      pago: boolean;
      dataPagamento?: string;
    }>;
  };
  // Campos específicos para entradas
  tipoEntrada?: TipoEntrada;
  statusRecebimento?: StatusRecebimento;
  dataPrevistaRecebimento?: string;
  cliente?: string;
  // Campos específicos para saídas
  tipoDespesa?: TipoDespesa;
  dataPrevistaPagamento?: string;
  fornecedor?: string;
  // Campos comuns adicionais
  formaPagamento?: FormaPagamento;
  numeroDocumento?: string;
  categoriaPersonalizada?: string;
}

const Financeiro = () => {
  const { t, i18n } = useTranslation();
  const { hasPermission } = useAuth();
  const { transacoes, balanco, adicionarTransacao, removerTransacao } = useFinanceiro();
  const theme = useTheme();
  
  const [pagamentos, setPagamentos] = useState<PagamentoProgramado[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openGraficos, setOpenGraficos] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState<'entrada' | 'saida'>('entrada');
  const [tabValue, setTabValue] = useState(0);
  const [filtroDialogAberto, setFiltroDialogAberto] = useState(false);
  const [filtros, setFiltros] = useState({
    descricao: '',
    dataInicio: '',
    dataFim: '',
    categoria: '',
    observacao: '',
    valorMin: '',
    valorMax: ''
  });

  interface FiltroAtivo {
    campo: string;
    valor: string;
  }

  const [filtrosAtivos, setFiltrosAtivos] = useState<FiltroAtivo[]>([]);

  const [formData, setFormData] = useState<FormData>({
    valor: '',
    data: format(new Date(), 'yyyy-MM-dd'),
    descricao: '',
    categoria: '',
    observacao: '',
    recorrencia: 'nenhuma'
  });
  
  const [formErrors, setFormErrors] = useState({
    valor: '',
    data: '',
    descricao: '',
    categoria: '',
    observacao: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  const [dialogoConfirmacao, setDialogoConfirmacao] = useState({
    aberto: false,
    mensagem: '',
    onConfirm: () => {},
    titulo: '',
    itemId: ''
  });

  const [carregando, setCarregando] = useState<boolean>(false);

  const handleOpenDialog = (tipo: 'entrada' | 'saida') => {
    setTipoTransacao(tipo);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      valor: '',
      data: format(new Date(), 'yyyy-MM-dd'),
      descricao: '',
      categoria: '',
      observacao: '',
      recorrencia: 'nenhuma'
    });
    setFormErrors({
      valor: '',
      data: '',
      descricao: '',
      categoria: '',
      observacao: ''
    });
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    if (!hasPermission('financeiro.editar')) {
      setSnackbar({
        open: true,
        message: t('acessoNegado'),
        severity: 'error',
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Transformar o formData em uma transação
      const novaTransacao = {
        tipo: tipoTransacao,
        valor: parseFloat(formData.valor),
        data: new Date(formData.data).toISOString(),
        descricao: formData.descricao,
        categoria: formData.categoria || t('finance_noCategory'),
        // Incluir campos do parcelamento se estiver habilitado
        ...(formData.parcelamento?.habilitado ? {
          parcelamento: {
            quantidadeParcelas: formData.parcelamento.quantidadeParcelas,
            parcelas: formData.parcelamento.parcelas
          }
        } : {}),
        // Campos específicos para entradas
        ...(tipoTransacao === 'entrada' ? {
          tipoEntrada: formData.tipoEntrada,
          statusRecebimento: formData.statusRecebimento,
          dataPrevistaRecebimento: formData.dataPrevistaRecebimento,
          cliente: formData.cliente,
        } : {}),
        // Campos específicos para saídas
        ...(tipoTransacao === 'saida' ? {
          tipoDespesa: formData.tipoDespesa,
          dataPrevistaPagamento: formData.dataPrevistaPagamento,
          fornecedor: formData.fornecedor,
        } : {}),
        // Campos comuns
        formaPagamento: formData.formaPagamento,
        numeroDocumento: formData.numeroDocumento,
        observacao: formData.observacao
      };
      
      // Adicionar transação
      await adicionarTransacao(novaTransacao);

      // Emitir evento apropriado
      const eventName = tipoTransacao === 'entrada' ? 'entrada.criada' : 'pagamento.criado';
      EventBus.emit(eventName, novaTransacao);

      // Antigo sistema de pagamentos programados (pode ser removido posteriormente)
      if (formData.recorrencia !== 'nenhuma' && tipoTransacao === 'saida') {
        const novoPagamento: PagamentoProgramado = {
          id: generateSecureId('pagamento'),
          descricao: formData.descricao,
          valor: parseFloat(formData.valor),
          dataVencimento: new Date(formData.data),
          pago: false,
          recorrencia: formData.recorrencia as any
        };
        
        setPagamentos(prev => [...prev, novoPagamento].sort((a, b) => 
          a.dataVencimento.getTime() - b.dataVencimento.getTime()
        ));
      }
      
      setSnackbar({
        open: true,
        message: tipoTransacao === 'entrada' ? t('mensagem_entradaAdicionada') : t('mensagem_saidaAdicionada'),
        severity: 'success'
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao adicionar transação', error);
      setSnackbar({
        open: true,
        message: t('mensagem_erroAdicionarTransacao'),
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      valor: '',
      data: '',
      descricao: '',
      categoria: '',
      observacao: ''
    };
    
    if (!validateNumberField(formData.valor, true)) {
      errors.valor = t('validator_required');
    } else if (parseFloat(formData.valor) <= 0) {
      errors.valor = t('validator_positiveNumber');
    }
    
    if (!validateDateField(formData.data, true)) {
      errors.data = t('validator_required');
    }
    
    if (!validateTextField(formData.descricao, true)) {
      errors.descricao = t('validator_required');
    }
    
    // Definir erros e verificar se há algum erro
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const filtrarTransacoes = () => {
    return transacoes.filter(transacao => {
      const dataTransacao = new Date(transacao.data);
      
      if (filtros.descricao && !transacao.descricao.toLowerCase().includes(filtros.descricao.toLowerCase())) {
        return false;
      }
      
      if (filtros.dataInicio && dataTransacao < new Date(filtros.dataInicio)) {
        return false;
      }
      
      if (filtros.dataFim && dataTransacao > new Date(filtros.dataFim)) {
        return false;
      }
      
      if (filtros.categoria && transacao.categoria !== filtros.categoria) {
        return false;
      }
      
      if (filtros.valorMin && transacao.valor < parseFloat(filtros.valorMin)) {
        return false;
      }
      
      if (filtros.valorMax && transacao.valor > parseFloat(filtros.valorMax)) {
        return false;
      }
      
      return true;
    });
  };

  const handleFilter = () => {
    setCarregando(true);
    setTimeout(() => {
      // Não precisamos fazer nada aqui, pois o useMemo já vai recalcular
      // transacoesFiltradas quando filtros mudar
      setCarregando(false);
    }, 300); // Pequeno atraso para mostrar o loader
  };

  const getDadosGraficos = () => {
    // Usar nomes de mês abreviados de acordo com o idioma atual
    const dataAtual = new Date();
    const mesesAbreviados: string[] = [];
    
    // Gerar lista de meses abreviados no idioma atual
    for (let i = 0; i < 12; i++) {
      const data = new Date(dataAtual.getFullYear(), i, 1);
      mesesAbreviados.push(format(data, 'MMM', { locale: getDateLocale() }).toLowerCase());
    }
    
    const anoAtual = new Date().getFullYear();
    
    const dadosMensaisIniciais: Record<string, { mes: string, entradas: number, saidas: number }> = {};
    
    mesesAbreviados.forEach((mes, index) => {
      const mesFormatado = `${mes} ${anoAtual}`;
      dadosMensaisIniciais[mesFormatado] = { 
        mes: mesFormatado, 
        entradas: 0, 
        saidas: 0 
      };
    });
    
    const dadosMensaisPorMes = { ...dadosMensaisIniciais };
    
    transacoes.forEach(transacao => {
      const data = new Date(transacao.data);
      // Usar o format para obter o mês abreviado no idioma atual
      const mes = format(data, 'MMM', { locale: getDateLocale() }).toLowerCase();
      const ano = data.getFullYear();
      const mesAno = `${mes} ${ano}`;
      
      if (!dadosMensaisPorMes[mesAno]) {
        dadosMensaisPorMes[mesAno] = { mes: mesAno, entradas: 0, saidas: 0 };
      }
      
      if (transacao.tipo === 'entrada') {
        dadosMensaisPorMes[mesAno].entradas += transacao.valor;
      } else {
        dadosMensaisPorMes[mesAno].saidas += transacao.valor;
      }
    });
    
    const dadosMensais = Object.values(dadosMensaisPorMes).sort((a, b) => {
      const [mesA, anoA] = a.mes.split(' ');
      const [mesB, anoB] = b.mes.split(' ');
      
      // Comparar anos primeiro
      if (parseInt(anoA) !== parseInt(anoB)) {
        return parseInt(anoA) - parseInt(anoB);
      }
      
      // Depois comparar meses - encontrar índice nos meses traduzidos
      const indexA = mesesAbreviados.indexOf(mesA);
      const indexB = mesesAbreviados.indexOf(mesB);
      return indexA - indexB;
    });

    // Usar nomes de dias da semana no idioma atual
    const diasSemana = [
      t('weekdays_sunday'),
      t('weekdays_monday'),
      t('weekdays_tuesday'),
      t('weekdays_wednesday'),
      t('weekdays_thursday'),
      t('weekdays_friday'),
      t('weekdays_saturday')
    ];
    
    const dadosPorDiaIniciais = diasSemana.map(dia => ({ name: dia, valor: 0 }));
    
    const entradasPorDia = [...dadosPorDiaIniciais];
    
    transacoes.forEach(transacao => {
      if (transacao.tipo === 'entrada') {
        const data = new Date(transacao.data);
        const diaSemana = data.getDay();
        entradasPorDia[diaSemana].valor += transacao.valor;
      }
    });

    const dadosPorMes = dadosMensais.map(item => ({
      name: item.mes,
      entrada: item.entradas,
      saida: item.saidas
    }));

    return { dadosPorDia: entradasPorDia, dadosPorMes };
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const atualizarFiltrosAtivos = () => {
    const novosFiltros: FiltroAtivo[] = [];
    
    if (filtros.descricao) {
      novosFiltros.push({
        campo: t('descricao'),
        valor: filtros.descricao
      });
    }
    
    if (filtros.dataInicio) {
      novosFiltros.push({
        campo: t('dataInicio'),
        valor: filtros.dataInicio
      });
    }
    
    if (filtros.dataFim) {
      novosFiltros.push({
        campo: t('dataFim'),
        valor: filtros.dataFim
      });
    }
    
    if (filtros.categoria) {
      novosFiltros.push({
        campo: t('categoria'),
        valor: filtros.categoria
      });
    }
    
    if (filtros.valorMin) {
      novosFiltros.push({
        campo: t('valorMin'),
        valor: `€${filtros.valorMin}`
      });
    }
    
    if (filtros.valorMax) {
      novosFiltros.push({
        campo: t('valorMax'),
        valor: `€${filtros.valorMax}`
      });
    }
    
    setFiltrosAtivos(novosFiltros);
  };

  useEffect(() => {
    atualizarFiltrosAtivos();
  }, [filtros]);

  const removerFiltro = (index: number) => {
    const filtro = filtrosAtivos[index];
    let novosFiltros = { ...filtros };
    
    switch (filtro.campo) {
      case t('descricao'):
        novosFiltros.descricao = '';
        break;
      case t('dataInicio'):
        novosFiltros.dataInicio = '';
        break;
      case t('dataFim'):
        novosFiltros.dataFim = '';
        break;
      case t('categoria'):
        novosFiltros.categoria = '';
        break;
      case t('valorMin'):
        novosFiltros.valorMin = '';
        break;
      case t('valorMax'):
        novosFiltros.valorMax = '';
        break;
    }
    
    setFiltros(novosFiltros);
  };

  const handleEditarTransacao = (transacao: any) => {
    setFormData({
      valor: transacao.valor.toString(),
      data: format(new Date(transacao.data), 'yyyy-MM-dd'),
      descricao: transacao.descricao,
      categoria: transacao.categoria || '',
      observacao: transacao.observacao || '',
      recorrencia: 'nenhuma'
    });
    setTipoTransacao(transacao.tipo);
    setOpenDialog(true);
  };

  const transacoesFiltradas = useMemo(() => {
    return filtrarTransacoes().sort((a, b) => {
      // Ordenar por data em ordem decrescente (mais recente primeiro)
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });
  }, [transacoes, filtros]);

  const handleRemoverTransacao = (id: string) => {
    setDialogoConfirmacao({
      aberto: true,
      titulo: t('finance_delete_title'),
      mensagem: t('finance_delete_confirmation'),
      itemId: id,
      onConfirm: () => {
        removerTransacao(id);
        setSnackbar({
          open: true,
          message: t('finance_delete_success'),
          severity: 'success'
        });
        setDialogoConfirmacao(prev => ({ ...prev, aberto: false }));
      }
    });
  };

  const handleRemoverPagamento = (id: string) => {
    setDialogoConfirmacao({
      aberto: true,
      titulo: t('finance_delete_paymentTitle'),
      mensagem: t('finance_delete_paymentConfirmation'),
      itemId: id,
      onConfirm: () => {
        setPagamentos(pagamentos.filter(p => p.id !== id));
        setSnackbar({
          open: true,
          message: t('finance_delete_paymentSuccess'),
          severity: 'success'
        });
        setDialogoConfirmacao(prev => ({ ...prev, aberto: false }));
      }
    });
  };

  const handleFecharConfirmacao = () => {
    setDialogoConfirmacao(prev => ({ ...prev, aberto: false }));
  };

  // Função para obter o locale do date-fns com base no idioma atual
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'pt':
        return ptBR;
      case 'de':
        return de;
      default:
        return enUS;
    }
  };

  // Função para formatar moeda de acordo com o idioma atual
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  // Função para formatar datas de acordo com o idioma atual
  const formatDate = (date: Date, formatStr: string = 'dd/MM/yyyy') => {
    return format(date, formatStr, { locale: getDateLocale() });
  };
  
  // Função para formatar data completa no estilo de cada idioma usando toLocaleDateString
  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString(i18n.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obter categorias traduzidas
  const getCategoriasSaida = () => {
    return [
      t('finance_salary'),
      t('finance_shopping'),
      t('finance_payments')
    ];
  };

  return (
    <Box>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('titulo')}</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Button
            component={Paper}
            onClick={() => handleOpenDialog('entrada')}
            fullWidth
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'success.light',
              color: 'white',
              '&:hover': {
                backgroundColor: 'success.main',
              }
            }}
          >
            <AddIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{t('novaEntrada')}</Typography>
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            component={Paper}
            onClick={() => handleOpenDialog('saida')}
            fullWidth
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'error.light',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.main',
              }
            }}
          >
            <RemoveIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">{t('novaSaida')}</Typography>
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {t('saldo')}: {formatCurrency(balanco.saldoAtual)}
              </Typography>
              <Button
                variant="contained"
                startIcon={<ChartIcon />}
                onClick={() => setOpenGraficos(true)}
              >
                {t('graficos')}
              </Button>
            </Box>

            <Typography variant="h6" gutterBottom>{t('filtros')}</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label={t('descricao')}
                  value={filtros.descricao}
                  onChange={(e) => setFiltros({ ...filtros, descricao: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label={t('dataInicio')}
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label={t('dataFim')}
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label={t('categoria')}
                  value={filtros.categoria}
                  onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label={t('observacao')}
                  value={filtros.observacao}
                  onChange={(e) => setFiltros({ ...filtros, observacao: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label={t('valorMin')}
                  type="number"
                  value={filtros.valorMin}
                  onChange={(e) => setFiltros({ ...filtros, valorMin: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label={t('valorMax')}
                  type="number"
                  value={filtros.valorMax}
                  onChange={(e) => setFiltros({ ...filtros, valorMax: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>{t('finance_latestTransactions')}</Typography>
            
            <Paper sx={{ mt: 2, mb: 2, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{t('finance_transactions')}</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<FilterListIcon />}
                  onClick={handleFilter}
                >
                  {t('finance_filter')}
                </Button>
              </Box>

              {filtrosAtivos.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ alignSelf: 'center', mr: 1 }}>
                    {t('finance_activeFilters')}:
                  </Typography>
                  {filtrosAtivos.map((filtro, index) => (
                    <Chip 
                      key={index} 
                      label={`${filtro.campo}: ${filtro.valor}`} 
                      onDelete={() => removerFiltro(index)} 
                      color="primary" 
                      size="small" 
                    />
                  ))}
                  <Button 
                    size="small" 
                    onClick={() => setFiltrosAtivos([])}
                    startIcon={<ClearIcon />}
                  >
                    {t('finance_clearFilters')}
                  </Button>
                </Box>
              )}

              {carregando ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {transacoesFiltradas.map((transacao, index) => (
                    <React.Fragment key={transacao.id}>
                      <ListItem 
                        sx={{
                          borderRadius: 1,
                          backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={3} sm={3} sx={{ textAlign: 'left', color: transacao.tipo === 'entrada' ? theme.palette.success.main : theme.palette.error.main }}>
                            {transacao.tipo === 'entrada' ? (
                              <>
                                <Typography variant="body1" fontWeight="bold">
                                  +{formatCurrency(transacao.valor)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {transacao.categoria || t('finance_noCategory')}
                                </Typography>
                              </>
                            ) : (
                              <></>
                            )}
                          </Grid>
                          
                          <Grid item xs={6} sm={6} sx={{ textAlign: 'center' }}>
                            <Typography variant="body1">
                              {formatDate(new Date(transacao.data))}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatFullDate(new Date(transacao.data))}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={3} sm={3} sx={{ textAlign: 'right', color: transacao.tipo === 'saida' ? theme.palette.error.main : theme.palette.success.main }}>
                            {transacao.tipo === 'saida' ? (
                              <>
                                <Typography variant="body1" fontWeight="bold">
                                  -{formatCurrency(transacao.valor)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {transacao.categoria || t('finance_noCategory')}
                                </Typography>
                              </>
                            ) : (
                              <></>
                            )}
                          </Grid>
                        </Grid>
                        
                        <IconButton 
                          edge="end" 
                          aria-label="editar"
                          onClick={() => handleEditarTransacao(transacao)}
                          sx={{ ml: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="excluir"
                          onClick={() => handleRemoverTransacao(transacao.id)}
                          sx={{ ml: 1 }}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItem>
                      {index < transacoesFiltradas.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  {transacoesFiltradas.length === 0 && (
                    <Typography variant="body1" sx={{ textAlign: 'center', my: 3, color: 'text.secondary' }}>
                      {t('finance_noTransactions')}
                    </Typography>
                  )}
                </List>
              )}
            </Paper>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>{t('pagamentosProximos')}</Typography>
            {pagamentos
              .sort((a, b) => a.dataVencimento.getTime() - b.dataVencimento.getTime())
              .map((pagamento) => (
                <Box
                  key={pagamento.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    backgroundColor: 'grey.100',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  <Box>
                    <Typography>
                      {pagamento.descricao} - {formatCurrency(pagamento.valor)}
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(pagamento.dataVencimento)} 
                      {!pagamento.pago && ` (${differenceInDays(pagamento.dataVencimento, new Date())} ${t('diasParaVencer')})`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={pagamento.pago}
                          onChange={(e) => {
                            setPagamentos(pagamentos.map(p =>
                              p.id === pagamento.id ? { ...p, pago: e.target.checked } : p
                            ));
                          }}
                        />
                      }
                      label={t('pago')}
                    />
                    <IconButton 
                      size="small"
                      onClick={() => {
                        console.log('Editar pagamento', pagamento);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      color="error"
                      onClick={() => handleRemoverPagamento(pagamento.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 8,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          py: 2,
          mb: 0,
          bgcolor: tipoTransacao === 'entrada' ? 'success.light' : 'error.light',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          {tipoTransacao === 'entrada' 
            ? t('registrarNovaEntrada') 
            : t('registrarNovaSaida')}
        </DialogTitle>

        <Box 
          sx={{ 
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            aria-label="formulário de transação"
            variant="fullWidth"
            sx={{ 
              '& .MuiTabs-indicator': {
                height: 3,
                backgroundColor: theme.palette.primary.main
              },
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '0.9rem',
                py: 1.5,
                '&.Mui-selected': {
                  color: 'primary.main',
                }
              }
            }}
          >
            <Tab 
              label={t('informacoesBasicas')} 
              id="tab-0" 
              aria-controls="tabpanel-0"
              sx={{
                borderRight: '1px solid',
                borderColor: 'divider',
              }}
            />
            {tipoTransacao === 'entrada' ? (
              <Tab 
                label={t('detalhesEntrada')} 
                id="tab-1" 
                aria-controls="tabpanel-1"
              />
            ) : (
              <Tab 
                label={t('detalhesSaida')} 
                id="tab-1" 
                aria-controls="tabpanel-1"
              />
            )}
          </Tabs>
        </Box>
        
        <DialogContent 
          sx={{ 
            p: 0,
            '&.MuiDialogContent-root': {
              pt: 0,
              pb: 2
            }
          }}
        >
          <TabPanel value={tabValue} index={0}>
            {tipoTransacao === 'entrada' ? (
              <FormularioEntrada
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            ) : (
              <FormularioSaida
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {tipoTransacao === 'entrada' ? (
              <FormularioEntrada
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            ) : (
              <FormularioSaida
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </TabPanel>
        </DialogContent>
        
        <DialogActions sx={{ borderTop: 1, borderColor: 'divider', py: 1.5 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ mx: 2 }}
          >
            {t('cancelar')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openGraficos}
        onClose={() => setOpenGraficos(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t('graficos')}
          <IconButton
            aria-label="close"
            onClick={() => setOpenGraficos(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t('finance_charts_monthlyIncome')}
                </Typography>
                <Paper style={{ height: 300, padding: 20 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getDadosGraficos().dadosPorMes}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="entrada" fill="#4caf50" name={t('finance_inputs') || "Entradas"} />
                      <Bar dataKey="saida" fill="#f44336" name={t('finance_outputs') || "Saídas"} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t('finance_charts_weekdayIncome')}
                </Typography>
                <Paper style={{ height: 300, padding: 20 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getDadosGraficos().dadosPorDia}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="valor" fill="#4caf50" name={t('finance_inputs') || "Entradas"} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGraficos(false)}>
            {t('fechar')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogoConfirmacao.aberto}
        onClose={handleFecharConfirmacao}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogoConfirmacao.titulo}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            {dialogoConfirmacao.mensagem}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharConfirmacao} color="primary">
            {t('finance_delete_cancel')}
          </Button>
          <Button onClick={() => dialogoConfirmacao.onConfirm()} color="error" autoFocus>
            {t('finance_delete_confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Financeiro;