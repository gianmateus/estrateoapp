import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
  Tooltip,
  Divider,
  TextField,
  Stack,
  Card,
  CardContent,
  Alert,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  FileDownload as DownloadIcon,
  BarChart as ChartIcon, 
  FilterList as FilterIcon,
  ClearAll as ClearAllIcon,
  EuroSymbol as EuroIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownwardIcon,
  AccountBalance as AccountBalanceIcon,
  PictureAsPdf as PdfIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { format, parseISO, isToday, isYesterday, startOfMonth, endOfMonth, isSameDay, compareDesc, isSameMonth } from 'date-fns';
import { ptBR, enUS, de, it } from 'date-fns/locale';
import { useTheme } from '@mui/material/styles';
import { useFinanceiro, Transacao } from '../contexts/FinanceiroContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Tipos e interfaces
interface Filtros {
  tipo: 'todos' | 'entrada' | 'saida';
  status: 'todos' | 'confirmado' | 'pendente';
  periodo: {
    inicio: string;
    fim: string;
  };
  origem: 'todos' | 'contas-a-pagar' | 'contas-a-receber' | 'manual';
}

// Função para obter localização de data com base no idioma
const getDateLocale = (lang: string) => {
  switch(lang) {
    case 'it': return it;
    case 'de': return de;
    case 'en': return enUS;
    default: return ptBR;
  }
};

// Componente principal de Fluxo de Caixa
const FluxoDeCaixa: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { transacoes, balanco, carregarDados } = useFinanceiro();
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({
    tipo: 'todos',
    status: 'todos',
    periodo: {
      inicio: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      fim: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    },
    origem: 'todos'
  });

  // Estatísticas financeiras do período
  const [estatisticas, setEstatisticas] = useState({
    totalEntradas: 0,
    totalSaidas: 0,
    saldoFinal: 0
  });

  // Efeito para carregar os dados na inicialização
  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      await carregarDados();
      setLoading(false);
    };
    
    buscarDados();
  }, [carregarDados]);

  // Filtragem das transações
  const transacoesFiltradas = useMemo(() => {
    // Filtrar as transações de acordo com os critérios
    return transacoes.filter(transacao => {
      // Filtro de tipo (entrada/saída)
      if (filtros.tipo !== 'todos' && transacao.tipo !== filtros.tipo) {
        return false;
      }
      
      // Filtro de status (confirmado/pendente)
      const isPago = transacao.parcelamento?.parcelas.some(parcela => parcela.pago) || false;
      if (filtros.status === 'confirmado' && !isPago) {
        return false;
      }
      if (filtros.status === 'pendente' && isPago) {
        return false;
      }
      
      // Filtro de período (datas)
      const dataTransacao = new Date(transacao.data);
      if (filtros.periodo.inicio && dataTransacao < new Date(filtros.periodo.inicio)) {
        return false;
      }
      if (filtros.periodo.fim && dataTransacao > new Date(filtros.periodo.fim)) {
        return false;
      }
      
      // Filtro de origem
      if (filtros.origem !== 'todos') {
        if (filtros.origem === 'contas-a-pagar' && transacao.tipo !== 'saida') {
          return false;
        }
        if (filtros.origem === 'contas-a-receber' && transacao.tipo !== 'entrada') {
          return false;
        }
        // Lógica para filtrar apenas entradas/saídas manuais poderia ser implementada aqui
      }
      
      return true;
    });
  }, [transacoes, filtros]);

  // Calcular estatísticas do período filtrado
  useEffect(() => {
    let totalEntradas = 0;
    let totalSaidas = 0;
    
    transacoesFiltradas.forEach(transacao => {
      if (transacao.tipo === 'entrada') {
        totalEntradas += transacao.valor;
      } else {
        totalSaidas += transacao.valor;
      }
    });
    
    setEstatisticas({
      totalEntradas,
      totalSaidas,
      saldoFinal: totalEntradas - totalSaidas
    });
  }, [transacoesFiltradas]);

  // Agrupar transações por dia
  const transacoesAgrupadasPorDia = useMemo(() => {
    const grupos: { [key: string]: Transacao[] } = {};
    
    // Ordenar transações por data (mais recentes primeiro)
    const transacoesOrdenadas = [...transacoesFiltradas].sort((a, b) => 
      compareDesc(new Date(a.data), new Date(b.data))
    );
    
    // Agrupar por dia
    transacoesOrdenadas.forEach(transacao => {
      const dataFormatada = format(new Date(transacao.data), 'yyyy-MM-dd');
      
      if (!grupos[dataFormatada]) {
        grupos[dataFormatada] = [];
      }
      
      grupos[dataFormatada].push(transacao);
    });
    
    return grupos;
  }, [transacoesFiltradas]);

  // Handler para atualizar filtros
  const handleFiltroChange = (novosFiltros: Partial<Filtros>) => {
    setFiltros(prev => ({
      ...prev,
      ...novosFiltros
    }));
  };

  // Handler para selects
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    handleFiltroChange({ [name as keyof Filtros]: value } as Partial<Filtros>);
  };

  // Handler para inputs de data
  const handleDateChange = (field: 'inicio' | 'fim') => (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiltroChange({
      periodo: {
        ...filtros.periodo,
        [field]: event.target.value
      }
    });
  };

  // Limpar todos os filtros
  const limparFiltros = () => {
    setFiltros({
      tipo: 'todos',
      status: 'todos',
      periodo: {
        inicio: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        fim: format(endOfMonth(new Date()), 'yyyy-MM-dd')
      },
      origem: 'todos'
    });
  };

  // Função para gerar relatório em PDF
  const gerarRelatorioPDF = async () => {
    setGerandoRelatorio(true);
    
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text(t('fluxoCaixa.titulo') || 'Fluxo de Caixa', 105, 15, { align: 'center' });
      
      // Período
      doc.setFontSize(12);
      doc.text(
        `${t('fluxoCaixa.periodo') || 'Período'}: ${format(new Date(filtros.periodo.inicio), 'dd/MM/yyyy')} - ${format(new Date(filtros.periodo.fim), 'dd/MM/yyyy')}`,
        105, 25, { align: 'center' }
      );
      
      // Resumo financeiro
      doc.setFontSize(14);
      doc.text(t('fluxoCaixa.resumoFinanceiro') || 'Resumo Financeiro', 20, 40);
      
      // Tabela de resumo
      (doc as any).autoTable({
        startY: 45,
        head: [[t('fluxoCaixa.totalEntradas') || 'Total Entradas', t('fluxoCaixa.totalSaidas') || 'Total Saídas', t('fluxoCaixa.saldoFinal') || 'Saldo Final']],
        body: [[
          `€ ${estatisticas.totalEntradas.toFixed(2)}`,
          `€ ${estatisticas.totalSaidas.toFixed(2)}`,
          `€ ${estatisticas.saldoFinal.toFixed(2)}`
        ]],
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] }
      });
      
      // Movimentações detalhadas
      doc.setFontSize(14);
      doc.text(t('fluxoCaixa.movimentacoesDetalhadas') || 'Movimentações Detalhadas', 20, (doc as any).lastAutoTable.finalY + 15);
      
      // Preparar dados para tabela de movimentações
      const movimentacoes = transacoesFiltradas.map(transacao => [
        format(new Date(transacao.data), 'dd/MM/yyyy'),
        transacao.tipo === 'entrada' ? t('fluxoCaixa.entrada') : t('fluxoCaixa.saida'),
        transacao.descricao,
        `€ ${transacao.valor.toFixed(2)}`,
        transacao.parcelamento?.parcelas.some(p => p.pago) ? 
          t('fluxoCaixa.confirmado') : t('fluxoCaixa.pendente')
      ]);
      
      // Tabela de movimentações
      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [[
          t('fluxoCaixa.data'), 
          t('fluxoCaixa.tipo'), 
          t('fluxoCaixa.descricao'), 
          t('fluxoCaixa.valor'), 
          t('fluxoCaixa.status')
        ]],
        body: movimentacoes,
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] }
      });
      
      // Rodapé
      const dataGeracao = format(new Date(), 'dd/MM/yyyy HH:mm');
      doc.setFontSize(10);
      doc.text(
        `${t('fluxoCaixa.geradoEm')}: ${dataGeracao}`,
        20, doc.internal.pageSize.height - 10
      );
      
      // Salvar o PDF
      doc.save(`fluxo-de-caixa-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setGerandoRelatorio(false);
    }
  };

  // Formatar moeda para exibição
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };

  // Componente de Relatório PDF
  const RelatorioPDF = () => (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={gerandoRelatorio ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
        onClick={gerarRelatorioPDF}
        disabled={gerandoRelatorio || transacoesFiltradas.length === 0}
        sx={{ ml: 2 }}
      >
        {gerandoRelatorio ? t('comum.gerando') : t('fluxoCaixa.gerarRelatorio')}
      </Button>
      
      {/* Modal de visualização */}
      <Dialog 
        open={openPreview} 
        onClose={() => setOpenPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t('fluxoCaixa.previewRelatorio')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {t('fluxoCaixa.titulo')}
            </Typography>
            
            <Typography variant="subtitle1" align="center" gutterBottom>
              {t('fluxoCaixa.periodo')}: {format(new Date(filtros.periodo.inicio), 'dd/MM/yyyy')} - {format(new Date(filtros.periodo.fim), 'dd/MM/yyyy')}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {t('fluxoCaixa.resumoFinanceiro')}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('fluxoCaixa.totalEntradas')}
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatarMoeda(estatisticas.totalEntradas)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('fluxoCaixa.totalSaidas')}
                </Typography>
                <Typography variant="h6" color="error.main">
                  {formatarMoeda(estatisticas.totalSaidas)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('fluxoCaixa.saldoFinal')}
                </Typography>
                <Typography 
                  variant="h6" 
                  color={estatisticas.saldoFinal >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatarMoeda(estatisticas.saldoFinal)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenPreview(false)} 
            color="inherit"
          >
            {t('comum.fechar')}
          </Button>
          <Button 
            onClick={gerarRelatorioPDF} 
            variant="contained" 
            color="primary"
            startIcon={<PdfIcon />}
            disabled={gerandoRelatorio}
          >
            {gerandoRelatorio ? 
              t('comum.gerando') : 
              t('comum.exportarPDF')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            {t('fluxoCaixa.titulo')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('fluxoCaixa.subtitulo')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <RelatorioPDF />
        </Grid>
      </Grid>

      {/* Cards de resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArrowUpIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" component="div">
                  {t('fluxoCaixa.totalEntradas')}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" color="success.main">
                {formatarMoeda(estatisticas.totalEntradas)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArrowDownwardIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6" component="div">
                  {t('fluxoCaixa.totalSaidas')}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" color="error.main">
                {formatarMoeda(estatisticas.totalSaidas)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" component="div">
                  {t('fluxoCaixa.saldoFinal')}
                </Typography>
              </Box>
              <Typography 
                variant="h4" 
                component="div" 
                color={estatisticas.saldoFinal >= 0 ? 'success.main' : 'error.main'}
              >
                {formatarMoeda(estatisticas.saldoFinal)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div">
            {t('fluxoCaixa.filtros.titulo')}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button 
            startIcon={<ClearAllIcon />} 
            onClick={limparFiltros}
            size="small"
          >
            {t('fluxoCaixa.filtros.limpar')}
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-label">{t('fluxoCaixa.filtros.tipo')}</InputLabel>
              <Select
                labelId="tipo-label"
                name="tipo"
                value={filtros.tipo}
                label={t('fluxoCaixa.filtros.tipo')}
                onChange={handleSelectChange}
              >
                <MenuItem value="todos">{t('fluxoCaixa.filtros.todos')}</MenuItem>
                <MenuItem value="entrada">{t('fluxoCaixa.filtros.entrada')}</MenuItem>
                <MenuItem value="saida">{t('fluxoCaixa.filtros.saida')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-label">{t('fluxoCaixa.filtros.status')}</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={filtros.status}
                label={t('fluxoCaixa.filtros.status')}
                onChange={handleSelectChange}
              >
                <MenuItem value="todos">{t('fluxoCaixa.filtros.todos')}</MenuItem>
                <MenuItem value="confirmado">{t('fluxoCaixa.filtros.confirmado')}</MenuItem>
                <MenuItem value="pendente">{t('fluxoCaixa.filtros.pendente')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="origem-label">{t('fluxoCaixa.filtros.origem')}</InputLabel>
              <Select
                labelId="origem-label"
                name="origem"
                value={filtros.origem}
                label={t('fluxoCaixa.filtros.origem')}
                onChange={handleSelectChange}
              >
                <MenuItem value="todos">{t('fluxoCaixa.filtros.todos')}</MenuItem>
                <MenuItem value="contas-a-pagar">{t('fluxoCaixa.filtros.contasAPagar')}</MenuItem>
                <MenuItem value="contas-a-receber">{t('fluxoCaixa.filtros.contasAReceber')}</MenuItem>
                <MenuItem value="manual">{t('fluxoCaixa.filtros.manual')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label={t('fluxoCaixa.filtros.de')}
                type="date"
                size="small"
                fullWidth
                value={filtros.periodo.inicio}
                onChange={handleDateChange('inicio')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label={t('fluxoCaixa.filtros.ate')}
                type="date"
                size="small"
                fullWidth
                value={filtros.periodo.fim}
                onChange={handleDateChange('fim')}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Lista de transações agrupadas por dia */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : transacoesFiltradas.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          {t('fluxoCaixa.nenhumaMovimentacao')}
        </Alert>
      ) : (
        <Box>
          {Object.entries(transacoesAgrupadasPorDia).map(([data, transacoesDoDia]) => (
            <Paper key={data} sx={{ mb: 3, overflow: 'hidden' }}>
              {/* Cabeçalho do dia */}
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'primary.main', 
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography variant="h6">
                  {(() => {
                    const dataObj = new Date(data);
                    const locale = getDateLocale(i18n.language);
                    
                    if (isToday(dataObj)) {
                      return t('fluxoCaixa.hoje');
                    } else if (isYesterday(dataObj)) {
                      return t('fluxoCaixa.ontem');
                    } else {
                      return format(dataObj, 'EEEE, dd MMMM yyyy', { locale });
                    }
                  })()}
                </Typography>
                
                <Box>
                  {/* Resumo do dia */}
                  {(() => {
                    const totalDia = transacoesDoDia.reduce((acc, t) => {
                      return t.tipo === 'entrada' 
                        ? acc + t.valor 
                        : acc - t.valor;
                    }, 0);
                    
                    return (
                      <Chip 
                        label={formatarMoeda(totalDia)}
                        color={totalDia >= 0 ? 'success' : 'error'}
                        variant="filled"
                      />
                    );
                  })()}
                </Box>
              </Box>
              
              {/* Lista de transações do dia */}
              <Box>
                {transacoesDoDia.map((transacao) => (
                  <Box 
                    key={transacao.id}
                    sx={{ 
                      p: 2, 
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none'
                      },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {/* Ícone de entrada/saída */}
                      <Box 
                        sx={{ 
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: transacao.tipo === 'entrada' 
                            ? 'success.light' 
                            : 'error.light',
                          color: '#fff',
                          mr: 2
                        }}
                      >
                        {transacao.tipo === 'entrada' 
                          ? <ArrowUpIcon /> 
                          : <ArrowDownwardIcon />}
                      </Box>
                      
                      {/* Descrição e detalhes */}
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {transacao.descricao}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transacao.tipo === 'entrada' 
                            ? (transacao.cliente || t('fluxoCaixa.cliente')) 
                            : (transacao.fornecedor || t('fluxoCaixa.fornecedor'))}
                          {transacao.observacao && ` • ${transacao.observacao}`}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Valor e status */}
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography 
                        variant="body1" 
                        fontWeight="bold"
                        color={transacao.tipo === 'entrada' ? 'success.main' : 'error.main'}
                      >
                        {transacao.tipo === 'entrada' ? '+' : '-'} {formatarMoeda(transacao.valor)}
                      </Typography>
                      
                      {/* Status com ícones */}
                      {(() => {
                        const isPago = transacao.parcelamento?.parcelas.some(p => p.pago) || false;
                        // Verificação de status cancelado - pode variar conforme a implementação do sistema
                        const isCancelado = false; // Removendo referência a propriedade inexistente
                        
                        if (isCancelado) {
                          return (
                            <Chip
                              size="small"
                              icon={<CancelIcon />}
                              label={t('fluxoCaixa.cancelado') || 'Cancelado'}
                              color="default"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          );
                        } else if (isPago) {
                          return (
                            <Chip
                              size="small"
                              icon={<CheckCircleIcon />}
                              label={t('fluxoCaixa.confirmado') || 'Confirmado'}
                              color="success"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          );
                        } else {
                          return (
                            <Chip
                              size="small"
                              icon={<AccessTimeIcon />}
                              label={t('fluxoCaixa.pendente') || 'Pendente'}
                              color="warning"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          );
                        }
                      })()}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FluxoDeCaixa; 