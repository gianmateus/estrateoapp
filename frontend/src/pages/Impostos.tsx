/**
 * Página de Impostos
 * 
 * Gerencia a visualização e controle de impostos, incluindo consulta de valores devidos,
 * registro de pagamentos, configurações fiscais e relatórios.
 */
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  Button, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Chip, 
  IconButton, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Alert, 
  Divider, 
  MenuItem, 
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Tooltip,
  FormHelperText
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Payment as PaymentIcon, 
  ExpandMore as ExpandMoreIcon, 
  LocalAtm as LocalAtmIcon, 
  BarChart as ChartIcon, 
  Settings as SettingsIcon, 
  FilterList as FilterIcon, 
  Print as PrintIcon, 
  Check as CheckIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useImpostos } from '../contexts/ImpostosContext';
import { 
  ConfiguracaoImposto, 
  ImpostoAplicado,
  TipoImposto,
  PeriodicidadeImposto,
  FiltroImpostos
} from '../types/Impostos';
import { format, parseISO, addDays, isAfter, isBefore } from 'date-fns';
import { ptBR, de, enUS } from 'date-fns/locale';

// Interface para o formato de exibição da data
interface FormatDateOptions {
  locale: Locale;
  format: string;
}

// Componente principal da página de Impostos
const Impostos: React.FC = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { 
    configuracoes, 
    impostos, 
    resumo, 
    adicionarConfiguracao,
    atualizarConfiguracao,
    removerConfiguracao,
    registrarImposto,
    pagarImposto,
    removerImposto,
    atualizarImposto,
    verificarVencimentosProximos,
    atualizarResumo
  } = useImpostos();

  // Estados
  const [tabAtiva, setTabAtiva] = useState(0);
  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [dialogoPagamentoAberto, setDialogoPagamentoAberto] = useState(false);
  const [impostoEmEdicao, setImpostoEmEdicao] = useState<ImpostoAplicado | null>(null);
  const [configuracaoEmEdicao, setConfiguracaoEmEdicao] = useState<ConfiguracaoImposto | null>(null);
  const [dialogoConfiguracaoAberto, setDialogoConfiguracaoAberto] = useState(false);
  const [errosForm, setErrosForm] = useState<Record<string, string>>({});
  const [filtros, setFiltros] = useState<FiltroImpostos>({});
  const [impostosExibidos, setImpostosExibidos] = useState<ImpostoAplicado[]>([]);
  const [dataPagamento, setDataPagamento] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [referenciaPagamento, setReferenciaPagamento] = useState('');
  const [dialogoFiltroAberto, setDialogoFiltroAberto] = useState(false);

  // Configurações para formatação de data
  const localeMap: Record<string, Locale> = {
    'pt-BR': ptBR,
    'de': de,
    'en': enUS
  };

  // Função para formatar datas com o locale correto
  const formatarData = (data: string, opcoes: Partial<FormatDateOptions> = {}) => {
    if (!data) return '';
    try {
      const locale = localeMap[i18n.language] || ptBR;
      const formatoData = opcoes.format || 'dd/MM/yyyy';
      return format(parseISO(data), formatoData, { locale });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return data;
    }
  };

  // Função para renderizar o status do imposto com chip colorido
  const renderizarStatus = (imposto: ImpostoAplicado) => {
    if (imposto.pago) {
      return (
        <Chip 
          label={t('pago')} 
          color="success" 
          size="small" 
          icon={<CheckIcon />} 
        />
      );
    }

    if (!imposto.dataVencimento) {
      return <Chip label={t('pendente')} color="warning" size="small" />;
    }

    const hoje = new Date();
    const dataVencimento = parseISO(imposto.dataVencimento);
    
    if (isBefore(dataVencimento, hoje)) {
      return <Chip label={t('vencido')} color="error" size="small" />;
    }
    
    const diferencaDias = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferencaDias <= 7) {
      return <Chip label={t('proximoVencimento')} color="warning" size="small" />;
    }

    return <Chip label={t('emDia')} color="info" size="small" />;
  };

  // Função para aplicar filtros
  const aplicarFiltros = () => {
    let impostosProcessados = [...impostos];
    
    if (filtros.dataInicio) {
      const dataInicio = parseISO(filtros.dataInicio);
      impostosProcessados = impostosProcessados.filter(imposto => 
        !imposto.dataVencimento || isAfter(parseISO(imposto.dataVencimento), dataInicio)
      );
    }
    
    if (filtros.dataFim) {
      const dataFim = parseISO(filtros.dataFim);
      impostosProcessados = impostosProcessados.filter(imposto => 
        !imposto.dataVencimento || isBefore(parseISO(imposto.dataVencimento), dataFim)
      );
    }
    
    if (filtros.pago !== undefined) {
      impostosProcessados = impostosProcessados.filter(imposto => imposto.pago === filtros.pago);
    }
    
    if (filtros.tipo && filtros.tipo.length > 0) {
      impostosProcessados = impostosProcessados.filter(imposto => 
        filtros.tipo?.includes(imposto.tipo)
      );
    }
    
    if (filtros.vencidos) {
      const hoje = new Date();
      impostosProcessados = impostosProcessados.filter(imposto => 
        imposto.dataVencimento && isBefore(parseISO(imposto.dataVencimento), hoje) && !imposto.pago
      );
    }
    
    if (filtros.proximosVencimentos) {
      const hoje = new Date();
      const em30Dias = addDays(hoje, 30);
      impostosProcessados = impostosProcessados.filter(imposto => 
        imposto.dataVencimento && 
        isAfter(parseISO(imposto.dataVencimento), hoje) &&
        isBefore(parseISO(imposto.dataVencimento), em30Dias) &&
        !imposto.pago
      );
    }
    
    setImpostosExibidos(impostosProcessados);
    setDialogoFiltroAberto(false);
  };

  // Atualizar impostos exibidos quando os impostos ou filtros mudarem
  useEffect(() => {
    aplicarFiltros();
  }, [impostos, filtros]);

  // Função para abrir o diálogo de pagamento de imposto
  const abrirDialogoPagamento = (imposto: ImpostoAplicado) => {
    setImpostoEmEdicao(imposto);
    setDataPagamento(format(new Date(), 'yyyy-MM-dd'));
    setReferenciaPagamento('');
    setDialogoPagamentoAberto(true);
  };

  // Função para registrar o pagamento de um imposto
  const registrarPagamentoImposto = () => {
    if (!impostoEmEdicao) return;
    
    pagarImposto(impostoEmEdicao.id, dataPagamento, referenciaPagamento);
    setDialogoPagamentoAberto(false);
    
    // Atualizar resumo de impostos
    atualizarResumo();
  };

  // Função para mapear tipos de impostos para seus nomes traduzidos
  const tipoImpostoParaNome = (tipo: TipoImposto): string => {
    const tipos: Record<TipoImposto, string> = {
      'ust': t('ust'),
      'gewerbesteuer': t('gewerbesteuer'),
      'soli': t('soli'),
      'kirchensteuer': t('kirchensteuer'),
      'sozialabgaben': t('sozialabgaben'),
      'einkommensteuer': t('einkommensteuer'),
      'grundsteuer': t('grundsteuer'),
      'kapitalertragsteuer': t('kapitalertragsteuer'),
      'importacao': t('importacao'),
      'taxa_fixa': t('taxaFixa'),
      'outro': t('outro')
    };
    return tipos[tipo] || tipo;
  };

  // Filtrar impostos vencidos ou próximos de vencer
  const impostosUrgentes = verificarVencimentosProximos(7);
  const impostosVencidos = impostos.filter(imposto => 
    imposto.dataVencimento && 
    isBefore(parseISO(imposto.dataVencimento), new Date()) && 
    !imposto.pago
  );

  const trocarTab = (evento: React.SyntheticEvent, novoValor: number) => {
    setTabAtiva(novoValor);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {t('impostos')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterIcon />}
                onClick={() => setDialogoFiltroAberto(true)}
              >
                {t('filtrar')}
              </Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setDialogoAberto(true)}
              >
                {t('registrarImposto')}
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<SettingsIcon />}
                onClick={() => setDialogoConfiguracaoAberto(true)}
              >
                {t('configuracoes')}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Resumo de impostos */}
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t('resumo')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('totalPendente')}
                    </Typography>
                    <Typography variant="h5">
                      €{resumo.totalPendente.toLocaleString(i18n.language)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: theme.palette.success.main, color: 'white' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('totalPago')}
                    </Typography>
                    <Typography variant="h5">
                      €{resumo.totalPago.toLocaleString(i18n.language)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: theme.palette.error.main, color: 'white' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('vencidos')}
                    </Typography>
                    <Typography variant="h5">
                      €{resumo.proximosVencimentos.vencidos.toLocaleString(i18n.language)}
                    </Typography>
                    <Typography variant="body2">
                      {impostosVencidos.length} {t('itens')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: theme.palette.warning.main, color: 'white' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('proximosVencimentos')}
                    </Typography>
                    <Typography variant="h5">
                      €{resumo.proximosVencimentos.proximos30Dias.toLocaleString(i18n.language)}
                    </Typography>
                    <Typography variant="body2">
                      {impostosUrgentes.length} {t('itens')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Abas para diferentes visualizações */}
        <Grid item xs={12}>
          <Paper sx={{ borderRadius: 2 }}>
            <Tabs
              value={tabAtiva}
              onChange={trocarTab}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label={t('todosImpostos')} />
              <Tab label={t('aPagar')} />
              <Tab label={t('pagos')} />
              <Tab label={t('vencidos')} />
              <Tab label={t('relatorios')} />
            </Tabs>
            
            {/* Conteúdo das abas */}
            <Box p={3}>
              {/* Tab: Todos os impostos */}
              {tabAtiva === 0 && (
                <>
                  <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('nome')}</TableCell>
                        <TableCell>{t('tipo')}</TableCell>
                        <TableCell align="right">{t('valor')}</TableCell>
                        <TableCell>{t('dataVencimento')}</TableCell>
                        <TableCell>{t('status')}</TableCell>
                        <TableCell align="right">{t('acoes')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {impostosExibidos.length > 0 ? (
                        impostosExibidos.map((imposto) => (
                          <TableRow key={imposto.id}>
                            <TableCell>{imposto.nome}</TableCell>
                            <TableCell>{tipoImpostoParaNome(imposto.tipo)}</TableCell>
                            <TableCell align="right">€{imposto.valorImposto.toLocaleString(i18n.language)}</TableCell>
                            <TableCell>
                              {imposto.dataVencimento ? formatarData(imposto.dataVencimento) : '-'}
                            </TableCell>
                            <TableCell>{renderizarStatus(imposto)}</TableCell>
                            <TableCell align="right">
                              {!imposto.pago && (
                                <Tooltip title={t('pagar')}>
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => abrirDialogoPagamento(imposto)}
                                  >
                                    <PaymentIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title={t('editar')}>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => {
                                    setImpostoEmEdicao(imposto);
                                    setDialogoAberto(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('excluir')}>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => {
                                    if (window.confirm(t('confirmarExclusaoImposto') || '')) {
                                      removerImposto(imposto.id);
                                    }
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            {t('nenhumImpostoEncontrado')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </>
              )}
              
              {/* Tab: Impostos a pagar */}
              {tabAtiva === 1 && (
                <>
                  <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('nome')}</TableCell>
                        <TableCell>{t('tipo')}</TableCell>
                        <TableCell align="right">{t('valor')}</TableCell>
                        <TableCell>{t('dataVencimento')}</TableCell>
                        <TableCell>{t('status')}</TableCell>
                        <TableCell align="right">{t('acoes')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {impostosExibidos
                        .filter(imposto => !imposto.pago)
                        .map((imposto) => (
                          <TableRow key={imposto.id}>
                            <TableCell>{imposto.nome}</TableCell>
                            <TableCell>{tipoImpostoParaNome(imposto.tipo)}</TableCell>
                            <TableCell align="right">€{imposto.valorImposto.toLocaleString(i18n.language)}</TableCell>
                            <TableCell>
                              {imposto.dataVencimento ? formatarData(imposto.dataVencimento) : '-'}
                            </TableCell>
                            <TableCell>{renderizarStatus(imposto)}</TableCell>
                            <TableCell align="right">
                              <Tooltip title={t('pagar')}>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => abrirDialogoPagamento(imposto)}
                                >
                                  <PaymentIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('editar')}>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => {
                                    setImpostoEmEdicao(imposto);
                                    setDialogoAberto(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </>
              )}
              
              {/* Tab: Impostos pagos */}
              {tabAtiva === 2 && (
                <>
                  <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('nome')}</TableCell>
                        <TableCell>{t('tipo')}</TableCell>
                        <TableCell align="right">{t('valor')}</TableCell>
                        <TableCell>{t('dataPagamento')}</TableCell>
                        <TableCell>{t('referencia')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {impostosExibidos
                        .filter(imposto => imposto.pago)
                        .map((imposto) => (
                          <TableRow key={imposto.id}>
                            <TableCell>{imposto.nome}</TableCell>
                            <TableCell>{tipoImpostoParaNome(imposto.tipo)}</TableCell>
                            <TableCell align="right">€{imposto.valorImposto.toLocaleString(i18n.language)}</TableCell>
                            <TableCell>
                              {imposto.dataPagamento ? formatarData(imposto.dataPagamento) : '-'}
                            </TableCell>
                            <TableCell>{imposto.documentoReferencia || '-'}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </>
              )}
              
              {/* Tab: Impostos vencidos */}
              {tabAtiva === 3 && (
                <>
                  {impostosVencidos.length > 0 ? (
                    <>
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {t('alertaImpostosVencidos', { count: impostosVencidos.length })}
                      </Alert>
                      <Table sx={{ minWidth: 650 }} size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('nome')}</TableCell>
                            <TableCell>{t('tipo')}</TableCell>
                            <TableCell align="right">{t('valor')}</TableCell>
                            <TableCell>{t('dataVencimento')}</TableCell>
                            <TableCell align="right">{t('acoes')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {impostosVencidos.map((imposto) => (
                            <TableRow key={imposto.id}>
                              <TableCell>{imposto.nome}</TableCell>
                              <TableCell>{tipoImpostoParaNome(imposto.tipo)}</TableCell>
                              <TableCell align="right">€{imposto.valorImposto.toLocaleString(i18n.language)}</TableCell>
                              <TableCell>
                                {imposto.dataVencimento ? formatarData(imposto.dataVencimento) : '-'}
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title={t('pagar')}>
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => abrirDialogoPagamento(imposto)}
                                  >
                                    <PaymentIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  ) : (
                    <Alert severity="success">
                      {t('semImpostosVencidos')}
                    </Alert>
                  )}
                </>
              )}
              
              {/* Tab: Relatórios */}
              {tabAtiva === 4 && (
                <>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    {t('relatoriosDisponiveisInfo')}
                  </Alert>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {t('relatorioAnual')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {t('relatorioAnualDescricao')}
                          </Typography>
                          <Button 
                            variant="outlined" 
                            startIcon={<PrintIcon />}
                          >
                            {t('gerarRelatorio')}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {t('relatorioMensal')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {t('relatorioMensalDescricao')}
                          </Typography>
                          <Button 
                            variant="outlined" 
                            startIcon={<PrintIcon />}
                          >
                            {t('gerarRelatorio')}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {t('relatorioImpostosVencidos')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {t('relatorioImpostosVencidosDescricao')}
                          </Typography>
                          <Button 
                            variant="outlined" 
                            startIcon={<PrintIcon />}
                          >
                            {t('gerarRelatorio')}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo de Filtro */}
      <Dialog 
        open={dialogoFiltroAberto} 
        onClose={() => setDialogoFiltroAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('filtrarImpostos')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('dataInicio')}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filtros.dataInicio || ''}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('dataFim')}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filtros.dataFim || ''}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="tipo-imposto-label">{t('tipoImposto')}</InputLabel>
                <Select
                  labelId="tipo-imposto-label"
                  multiple
                  value={filtros.tipo || []}
                  onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value as TipoImposto[] })}
                  label={t('tipoImposto')}
                >
                  <MenuItem value="ust">{t('ust')}</MenuItem>
                  <MenuItem value="gewerbesteuer">{t('gewerbesteuer')}</MenuItem>
                  <MenuItem value="soli">{t('soli')}</MenuItem>
                  <MenuItem value="kirchensteuer">{t('kirchensteuer')}</MenuItem>
                  <MenuItem value="sozialabgaben">{t('sozialabgaben')}</MenuItem>
                  <MenuItem value="einkommensteuer">{t('einkommensteuer')}</MenuItem>
                  <MenuItem value="grundsteuer">{t('grundsteuer')}</MenuItem>
                  <MenuItem value="kapitalertragsteuer">{t('kapitalertragsteuer')}</MenuItem>
                  <MenuItem value="importacao">{t('importacao')}</MenuItem>
                  <MenuItem value="taxa_fixa">{t('taxaFixa')}</MenuItem>
                  <MenuItem value="outro">{t('outro')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-pagamento-label">{t('statusPagamento')}</InputLabel>
                <Select
                  labelId="status-pagamento-label"
                  value={filtros.pago === undefined ? '' : filtros.pago ? 'pago' : 'pendente'}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (valor === '') {
                      const { pago, ...restoFiltros } = filtros;
                      setFiltros(restoFiltros);
                    } else {
                      setFiltros({ ...filtros, pago: valor === 'pago' });
                    }
                  }}
                  label={t('statusPagamento')}
                >
                  <MenuItem value="">{t('todos')}</MenuItem>
                  <MenuItem value="pago">{t('pago')}</MenuItem>
                  <MenuItem value="pendente">{t('pendente')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant={filtros.vencidos ? "contained" : "outlined"}
                      fullWidth
                      onClick={() => setFiltros({ ...filtros, vencidos: !filtros.vencidos })}
                    >
                      {t('mostrarVencidos')}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant={filtros.proximosVencimentos ? "contained" : "outlined"}
                      fullWidth
                      onClick={() => setFiltros({ ...filtros, proximosVencimentos: !filtros.proximosVencimentos })}
                    >
                      {t('proximosVencimentos')}
                    </Button>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFiltros({})}>
            {t('limparFiltros')}
          </Button>
          <Button onClick={() => setDialogoFiltroAberto(false)}>
            {t('cancelar')}
          </Button>
          <Button onClick={aplicarFiltros} variant="contained">
            {t('aplicar')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Pagamento de Imposto */}
      <Dialog 
        open={dialogoPagamentoAberto} 
        onClose={() => setDialogoPagamentoAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('registrarPagamento')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                {t('registrandoPagamento')} <strong>{impostoEmEdicao?.nome}</strong> {t('noValorDe')} <strong>€{impostoEmEdicao?.valorImposto.toLocaleString(i18n.language)}</strong>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('dataPagamento')}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('referenciaPagamento')}
                fullWidth
                value={referenciaPagamento}
                onChange={(e) => setReferenciaPagamento(e.target.value)}
                placeholder={t('referenciaPlaceholder') || ''}
                helperText={t('referenciaHelp') || ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoPagamentoAberto(false)}>
            {t('cancelar')}
          </Button>
          <Button onClick={registrarPagamentoImposto} variant="contained" color="success">
            {t('confirmarPagamento')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Impostos; 