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
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, BarChart as ChartIcon, Edit as EditIcon, Close as CloseIcon, FilterList as FilterListIcon, Clear as ClearIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useFinanceiro } from '../contexts/FinanceiroContext';
import { generateSecureId } from '../utils/security';
import { validateTextField, validateNumberField, validateDateField } from '../utils/validation';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface PagamentoProgramado {
  id: string;
  descricao: string;
  valor: number;
  dataVencimento: Date;
  pago: boolean;
  recorrencia?: 'quinzenal' | 'mensal' | 'trimestral' | 'nenhuma';
}

const categoriasSaida = ['Salário', 'Compras', 'Pagamentos'];
const idiomas = [
  { codigo: 'pt-BR', nome: 'Português', bandeira: '🇧🇷' },
  { codigo: 'it-IT', nome: 'Italiano', bandeira: '🇮🇹' },
  { codigo: 'de-DE', nome: 'Alemão', bandeira: '🇩🇪' },
  { codigo: 'en-US', nome: 'English', bandeira: '🇺🇸' }
];

const Financeiro = () => {
  const { t, i18n } = useTranslation();
  const { hasPermission } = useAuth();
  const { transacoes, balanco, adicionarTransacao, removerTransacao } = useFinanceiro();
  const theme = useTheme();
  
  const [pagamentos, setPagamentos] = useState<PagamentoProgramado[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openGraficos, setOpenGraficos] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState<'entrada' | 'saida'>('entrada');
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

  const [formData, setFormData] = useState({
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
  };

  const handleSubmit = async () => {
    if (!hasPermission('financeiro.editar')) {
      setSnackbar({
        open: true,
        message: 'Você não tem permissão para adicionar transações',
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
      
      adicionarTransacao({
        tipo: tipoTransacao,
        valor: parseFloat(formData.valor),
        data: new Date(formData.data).toISOString(),
        descricao: formData.descricao,
        categoria: formData.categoria || "Sem categoria",
        metodoPagamento: formData.observacao || undefined,
        observacao: formData.observacao
      });

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
        message: `${tipoTransacao === 'entrada' ? 'Entrada' : 'Saída'} adicionada com sucesso!`,
        severity: 'success'
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao adicionar transação', error);
      setSnackbar({
        open: true,
        message: 'Erro ao adicionar transação, tente novamente',
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
    
    const valorValidation = validateNumberField(formData.valor, 'Valor', { required: true, min: 0.01 });
    if (!valorValidation.isValid) {
      errors.valor = valorValidation.message || 'Valor inválido';
    }
    
    const dataValidation = validateDateField(formData.data, 'Data', { required: true });
    if (!dataValidation.isValid) {
      errors.data = dataValidation.message || 'Data inválida';
    }
    
    const descricaoValidation = validateTextField(formData.descricao, 'Descrição', { required: true, minLength: 3, maxLength: 100 });
    if (!descricaoValidation.isValid) {
      errors.descricao = descricaoValidation.message || 'Descrição inválida';
    }
    
    setFormErrors(errors);
    
    return !Object.values(errors).some(error => error !== '');
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

  const getDadosGraficos = () => {
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const anoAtual = new Date().getFullYear();
    
    const dadosMensaisIniciais: Record<string, { mes: string, entradas: number, saidas: number }> = {};
    
    meses.forEach((mes, index) => {
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
      const mes = meses[data.getMonth()];
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
      const indexA = meses.indexOf(mesA);
      const indexB = meses.indexOf(mesB);
      if (anoA !== anoB) return parseInt(anoA) - parseInt(anoB);
      return indexA - indexB;
    });

    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
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
    return filtrarTransacoes();
  }, [transacoes, filtros]);

  const handleRemoverTransacao = (id: string) => {
    setDialogoConfirmacao({
      aberto: true,
      titulo: t('financeiro.excluir.titulo'),
      mensagem: t('financeiro.excluir.confirmacao'),
      itemId: id,
      onConfirm: () => {
        removerTransacao(id);
        setSnackbar({
          open: true,
          message: t('financeiro.excluir.sucesso'),
          severity: 'success'
        });
        setDialogoConfirmacao(prev => ({ ...prev, aberto: false }));
      }
    });
  };

  const handleRemoverPagamento = (id: string) => {
    setDialogoConfirmacao({
      aberto: true,
      titulo: t('financeiro.excluir.tituloPagamento'),
      mensagem: t('financeiro.excluir.confirmacaoPagamento'),
      itemId: id,
      onConfirm: () => {
        setPagamentos(pagamentos.filter(p => p.id !== id));
        setSnackbar({
          open: true,
          message: t('financeiro.excluir.sucessoPagamento'),
          severity: 'success'
        });
        setDialogoConfirmacao(prev => ({ ...prev, aberto: false }));
      }
    });
  };

  const handleFecharConfirmacao = () => {
    setDialogoConfirmacao(prev => ({ ...prev, aberto: false }));
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          {idiomas.map(({ codigo, bandeira }) => (
            <Button
              key={codigo}
              onClick={() => i18n.changeLanguage(codigo)}
              sx={{
                minWidth: 'auto',
                p: 1,
                fontSize: '1.5rem',
                opacity: i18n.language === codigo ? 1 : 0.5
              }}
            >
              {bandeira}
            </Button>
          ))}
        </Box>
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
            <Typography variant="h6">{t('entrada')}</Typography>
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
            <Typography variant="h6">{t('saida')}</Typography>
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {t('saldo')}: €{balanco.saldoAtual.toFixed(2)}
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

            <Typography variant="h6" gutterBottom>{t('ultimasTransacoes')}</Typography>
            
            <Paper sx={{ mt: 2, mb: 2, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{t('financeiro.movimentacoes')}</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<FilterListIcon />}
                  onClick={() => setFiltroDialogAberto(true)}
                >
                  {t('financeiro.filtrar')}
                </Button>
              </Box>

              {filtrosAtivos.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ alignSelf: 'center', mr: 1 }}>
                    {t('financeiro.filtrosAtivos')}:
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
                    {t('financeiro.limparFiltros')}
                  </Button>
                </Box>
              )}

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
                                +€{transacao.valor.toFixed(2)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {transacao.categoria}
                              </Typography>
                            </>
                          ) : (
                            <></>
                          )}
                        </Grid>
                        
                        <Grid item xs={6} sm={6} sx={{ textAlign: 'center' }}>
                          <Typography variant="body1">
                            {format(new Date(transacao.data), 'dd/MM/yyyy')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(transacao.data), 'EEEE', { locale: ptBR })}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={3} sm={3} sx={{ textAlign: 'right', color: transacao.tipo === 'saida' ? theme.palette.error.main : theme.palette.success.main }}>
                          {transacao.tipo === 'saida' ? (
                            <>
                              <Typography variant="body1" fontWeight="bold">
                                -€{transacao.valor.toFixed(2)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {transacao.categoria}
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
                    {t('financeiro.nenhumaTransacao')}
                  </Typography>
                )}
              </List>
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
                      {pagamento.descricao} - €{pagamento.valor.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      {format(pagamento.dataVencimento, "dd/MM/yyyy")} 
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {tipoTransacao === 'entrada' ? <AddIcon sx={{ mr: 1 }} /> : <RemoveIcon sx={{ mr: 1 }} />}
            {tipoTransacao === 'entrada' ? t('novaEntrada') : t('novaSaida')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label={t('valor')}
              type="number"
              fullWidth
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              error={!!formErrors.valor}
              helperText={formErrors.valor}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                inputProps: { min: 0.01, step: 0.01 }
              }}
            />
            <TextField
              margin="dense"
              label={t('data')}
              type="date"
              fullWidth
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              error={!!formErrors.data}
              helperText={formErrors.data}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label={t('descricao')}
              fullWidth
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              error={!!formErrors.descricao}
              helperText={formErrors.descricao}
              InputProps={{
                inputProps: { maxLength: 100 }
              }}
            />
            {tipoTransacao === 'saida' && (
              <>
                <TextField
                  margin="dense"
                  label={t('categoria')}
                  select
                  fullWidth
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  error={!!formErrors.categoria}
                  helperText={formErrors.categoria}
                >
                  {categoriasSaida.map((categoria) => (
                    <MenuItem key={categoria} value={categoria}>
                      {categoria}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControl fullWidth margin="dense">
                  <InputLabel>{t('financeiro.recorrencia')}</InputLabel>
                  <Select
                    value={formData.recorrencia}
                    onChange={(e) => setFormData({ ...formData, recorrencia: e.target.value })}
                    label={t('financeiro.recorrencia')}
                  >
                    <MenuItem value="nenhuma">{t('financeiro.recorrencia.nenhuma')}</MenuItem>
                    <MenuItem value="quinzenal">{t('financeiro.recorrencia.quinzenal')}</MenuItem>
                    <MenuItem value="mensal">{t('financeiro.recorrencia.mensal')}</MenuItem>
                    <MenuItem value="trimestral">{t('financeiro.recorrencia.trimestral')}</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            <TextField
              margin="dense"
              label={t('observacao')}
              fullWidth
              multiline
              rows={2}
              value={formData.observacao}
              onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              error={!!formErrors.observacao}
              helperText={formErrors.observacao}
              InputProps={{
                inputProps: { maxLength: 200 }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>{t('cancelar')}</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color={tipoTransacao === 'entrada' ? 'primary' : 'error'}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : t('confirmar')}
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
                  {t('financeiro.graficos.entradasPorMes')}
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
                      <Tooltip formatter={(value) => `€${value}`} />
                      <Legend />
                      <Bar dataKey="entrada" fill="#4caf50" name={t('financeiro.entradas')} />
                      <Bar dataKey="saida" fill="#f44336" name={t('financeiro.saidas')} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t('financeiro.graficos.entradasPorDiaSemana')}
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
                      <Tooltip formatter={(value) => `€${value}`} />
                      <Legend />
                      <Bar dataKey="valor" fill="#4caf50" name={t('financeiro.entradas')} />
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
            {t('financeiro.excluir.cancelar')}
          </Button>
          <Button onClick={() => dialogoConfirmacao.onConfirm()} color="error" autoFocus>
            {t('financeiro.excluir.confirmar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Financeiro;