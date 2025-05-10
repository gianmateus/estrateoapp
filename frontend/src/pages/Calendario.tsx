import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { format, getDaysInMonth, startOfMonth, getDay, parseISO, isSameDay } from 'date-fns';
import { ptBR, enUS, de } from 'date-fns/locale';
import { useTheme } from '@mui/material/styles';

// Interface para representar uma transação financeira
interface Transacao {
  id: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  descricao: string;
  data: string; // formato ISO 8601
  categoria: string;
  realizado: boolean;
}

// Interface para representar um pagamento
interface Pagamento {
  id: string;
  nome: string;
  valor: number;
  categoria: string;
  vencimento: string; // formato ISO 8601
  notaFiscal?: string;
  descricao?: string;
  recorrencia: 'nenhuma' | 'semanal' | 'quinzenal' | 'mensal' | 'trimestral';
  pago: boolean;
  createdAt: string; // formato ISO 8601
}

// Função para obter localização de data com base no idioma
const getDateLocale = (lang: string) => {
  switch(lang) {
    case 'de': return de;
    case 'en': return enUS;
    default: return ptBR;
  }
};

// Componente principal de Calendário
const Calendario = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  
  // Estados
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [detalhesAberto, setDetalhesAberto] = useState(false);

  // Mock de dados para desenvolvimento
  const mockTransacoes: Transacao[] = [
    {
      id: '1',
      tipo: 'entrada',
      valor: 1500,
      descricao: 'Venda diária',
      data: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(),
      categoria: 'vendas',
      realizado: true
    },
    {
      id: '2',
      tipo: 'entrada',
      valor: 2200,
      descricao: 'Venda diária',
      data: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString(),
      categoria: 'vendas',
      realizado: true
    },
    {
      id: '3',
      tipo: 'saida',
      valor: 350,
      descricao: 'Compra de insumos',
      data: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString(),
      categoria: 'compras',
      realizado: true
    },
    {
      id: '4',
      tipo: 'entrada',
      valor: 1800,
      descricao: 'Venda diária',
      data: new Date(new Date().getFullYear(), new Date().getMonth(), 24).toISOString(),
      categoria: 'vendas',
      realizado: true
    },
    {
      id: '5',
      tipo: 'saida',
      valor: 500,
      descricao: 'Pagamento fornecedor',
      data: new Date(new Date().getFullYear(), new Date().getMonth(), 24).toISOString(),
      categoria: 'fornecedor',
      realizado: true
    }
  ];

  const mockPagamentos: Pagamento[] = [
    {
      id: '1',
      nome: 'Aluguel',
      valor: 2500,
      categoria: 'financiamento',
      vencimento: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString(),
      descricao: 'Aluguel mensal',
      recorrencia: 'mensal',
      pago: false,
      createdAt: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString()
    },
    {
      id: '2',
      nome: 'Fornecedor de Verduras',
      valor: 870.50,
      categoria: 'fornecedor',
      vencimento: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(),
      notaFiscal: 'NF9865478',
      recorrencia: 'semanal',
      pago: false,
      createdAt: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    },
    {
      id: '3',
      nome: 'Internet',
      valor: 130,
      categoria: 'internet',
      vencimento: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString(),
      recorrencia: 'mensal',
      pago: false,
      createdAt: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    }
  ];

  // Buscar dados
  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));
        setTransacoes(mockTransacoes);
        setPagamentos(mockPagamentos);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  // Nomes dos meses no idioma atual
  const nomesMeses = useMemo(() => {
    const locale = getDateLocale(i18n.language);
    return Array.from({ length: 12 }, (_, i) => 
      format(new Date(2021, i, 1), 'MMMM', { locale })
    );
  }, [i18n.language]);

  // Gerar anos disponíveis (atual - 1 até atual + 5)
  const anosDisponiveis = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => anoAtual - 1 + i);
  }, []);

  // Calcular células do calendário para o mês selecionado
  const diasDoCalendario = useMemo(() => {
    // Obter o primeiro dia do mês
    const primeiroDiaDoMes = new Date(anoSelecionado, mesSelecionado, 1);
    
    // Obter o número de dias no mês
    const diasNoMes = getDaysInMonth(primeiroDiaDoMes);
    
    // Obter o dia da semana do primeiro dia (0 = domingo, 1 = segunda, ...)
    const primeiroDiaSemana = getDay(primeiroDiaDoMes);
    
    // Ajuste para que a segunda-feira seja o primeiro dia da semana (0 = segunda, ... 6 = domingo)
    const primeiroDiaAjustado = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1;
    
    const dias = [];
    
    // Adicionar células vazias para os dias anteriores ao início do mês
    for (let i = 0; i < primeiroDiaAjustado; i++) {
      dias.push(null);
    }
    
    // Adicionar os dias do mês
    for (let i = 1; i <= diasNoMes; i++) {
      dias.push(new Date(anoSelecionado, mesSelecionado, i));
    }
    
    // Calcular quantas células faltam para completar a última semana
    const celulasRestantes = 7 - (dias.length % 7);
    if (celulasRestantes < 7) {
      for (let i = 0; i < celulasRestantes; i++) {
        dias.push(null);
      }
    }
    
    return dias;
  }, [anoSelecionado, mesSelecionado]);

  // Calcular totais por dia
  const calcularTotaisPorDia = (data: Date) => {
    let entradas = 0;
    let saidas = 0;

    // Entradas do financial
    transacoes.forEach(transacao => {
      const dataTransacao = parseISO(transacao.data);
      if (isSameDay(dataTransacao, data)) {
        if (transacao.tipo === 'entrada' && transacao.realizado) {
          entradas += transacao.valor;
        } else if (transacao.tipo === 'saida' && transacao.realizado) {
          saidas += transacao.valor;
        }
      }
    });

    // Pagamentos
    pagamentos.forEach(pagamento => {
      const dataPagamento = parseISO(pagamento.vencimento);
      if (isSameDay(dataPagamento, data)) {
        saidas += pagamento.valor;
      }
    });

    return { entradas, saidas };
  };

  // Abrir detalhes do dia
  const handleAbrirDetalhes = (data: Date) => {
    setDiaSelecionado(data);
    setDetalhesAberto(true);
  };

  // Fechar detalhes
  const handleFecharDetalhes = () => {
    setDetalhesAberto(false);
  };

  // Obter transações e pagamentos do dia selecionado
  const obterTransacoesDoDia = () => {
    if (!diaSelecionado) return { entradas: [], saidas: [], pagamentosDoDia: [] };

    const entradas = transacoes.filter(
      t => t.tipo === 'entrada' && isSameDay(parseISO(t.data), diaSelecionado)
    );
    
    const saidas = transacoes.filter(
      t => t.tipo === 'saida' && isSameDay(parseISO(t.data), diaSelecionado)
    );
    
    const pagamentosDoDia = pagamentos.filter(
      p => isSameDay(parseISO(p.vencimento), diaSelecionado)
    );

    return { entradas, saidas, pagamentosDoDia };
  };

  // Formatar para moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(valor);
  };
  
  // Formatar para moeda com detalhes (usado no modal de detalhes)
  const formatarMoedaDetalhado = (valor: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };

  // Obter abreviação do dia da semana (3 letras)
  const getDiaSemanaAbreviado = (data: Date) => {
    const locale = getDateLocale(i18n.language);
    return format(data, 'EEE', { locale }).substring(0, 3);
  };

  // Renderizar célula do calendário
  const renderizarCelula = (data: Date | null) => {
    if (!data) return (
      <Box sx={{ 
        height: 120, 
        p: 1,
        border: '1px solid #e0e0e0',
        bgcolor: 'background.paper',
        opacity: 0.5
      }} />
    );

    const { entradas, saidas } = calcularTotaisPorDia(data);
    const dia = data.getDate();
    const diaSemana = getDiaSemanaAbreviado(data);
    
    return (
      <Box 
        sx={{ 
          height: 120, 
          p: 1, 
          border: '1px solid #e0e0e0',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          bgcolor: 'background.paper',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }
        }}
        onClick={() => handleAbrirDetalhes(data)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography 
            variant="body1"
            fontWeight="bold"
          >
            {dia}
          </Typography>
          <Typography 
            variant="caption"
            color="text.secondary"
          >
            {diaSemana}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 1 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 'auto' }}>
          {entradas > 0 && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'success.main', 
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              >
                Entrada:
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'success.main', 
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              >
                {formatarMoeda(entradas)}
              </Typography>
            </Box>
          )}
          
          {saidas > 0 && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'error.main', 
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              >
                Saída:
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'error.main', 
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              >
                {formatarMoeda(saidas)}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // Agrupar dias por semana para renderização do calendário
  const diasPorSemana = useMemo(() => {
    const semanas: (Date | null)[][] = [];
    let semanaAtual: (Date | null)[] = [];
    
    diasDoCalendario.forEach((dia, index) => {
      semanaAtual.push(dia);
      
      if ((index + 1) % 7 === 0) {
        semanas.push(semanaAtual);
        semanaAtual = [];
      }
    });
    
    // Adicionar a última semana se não estiver completa
    if (semanaAtual.length > 0) {
      semanas.push(semanaAtual);
    }
    
    return semanas;
  }, [diasDoCalendario]);

  // Componente de UI
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('calendario')}
      </Typography>
      
      {/* Seletor de Ano */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2, 
        overflow: 'auto',
        p: 1,
        mb: 1,
        borderRadius: 1,
        bgcolor: 'background.paper',
        boxShadow: 1
      }}>
        {anosDisponiveis.map(ano => (
          <Button
            key={ano}
            variant={anoSelecionado === ano ? "contained" : "outlined"}
            onClick={() => setAnoSelecionado(ano)}
            sx={{ 
              minWidth: '80px',
              px: 2
            }}
          >
            {ano}
          </Button>
        ))}
      </Box>
      
      {/* Seletor de Mês */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        p: 1,
        mb: 2,
        borderRadius: 1,
        bgcolor: 'background.paper',
        boxShadow: 1
      }}>
        {nomesMeses.map((mes, index) => (
          <Button
            key={index}
            variant={mesSelecionado === index ? "contained" : "text"}
            onClick={() => setMesSelecionado(index)}
            sx={{ 
              flex: { xs: '1 0 30%', sm: '1 0 15%', md: '1 0 8%' },
              textTransform: 'capitalize',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
            }}
          >
            {mes}
          </Button>
        ))}
      </Box>

      {/* Exibição do mês e ano selecionado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            if (mesSelecionado === 0) {
              setMesSelecionado(11);
              setAnoSelecionado(anoSelecionado - 1);
            } else {
              setMesSelecionado(mesSelecionado - 1);
            }
          }}
        >
          {t('mesAnterior')}
        </Button>
        
        <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
          {nomesMeses[mesSelecionado]} {anoSelecionado}
        </Typography>
        
        <Button
          endIcon={<ArrowForwardIcon />}
          onClick={() => {
            if (mesSelecionado === 11) {
              setMesSelecionado(0);
              setAnoSelecionado(anoSelecionado + 1);
            } else {
              setMesSelecionado(mesSelecionado + 1);
            }
          }}
        >
          {t('proximoMes')}
        </Button>
      </Box>

      {/* Calendário */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 1, borderRadius: 2, overflow: 'hidden' }}>
          {/* Cabeçalho dos dias da semana */}
          <Grid container>
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((dia, i) => (
              <Grid item xs key={i} sx={{ p: 1, textAlign: 'center', borderBottom: '1px solid #e0e0e0', bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" fontWeight="bold">{dia}</Typography>
              </Grid>
            ))}
          </Grid>
          
          {/* Semanas do mês */}
          {diasPorSemana.map((semana, indexSemana) => (
            <Grid container key={`semana-${indexSemana}`}>
              {semana.map((dia, indexDia) => (
                <Grid item xs key={`dia-${indexSemana}-${indexDia}`}>
                  {renderizarCelula(dia)}
                </Grid>
              ))}
            </Grid>
          ))}
        </Paper>
      )}

      {/* Modal de detalhes do dia */}
      <Dialog
        open={detalhesAberto}
        onClose={handleFecharDetalhes}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {diaSelecionado && format(diaSelecionado, 'EEEE, dd MMMM yyyy', { locale: getDateLocale(i18n.language) })}
        </DialogTitle>
        
        <DialogContent dividers>
          {diaSelecionado && (
            <>
              {/* Resumo do dia */}
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('entradas')}
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatarMoedaDetalhado(calcularTotaisPorDia(diaSelecionado).entradas)}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" align="right">
                    {t('saidas')}
                  </Typography>
                  <Typography variant="h6" color="error.main" align="right">
                    {formatarMoedaDetalhado(calcularTotaisPorDia(diaSelecionado).saidas)}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Lista de entradas */}
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {t('entradas')}
              </Typography>
              
              {obterTransacoesDoDia().entradas.length > 0 ? (
                <List>
                  {obterTransacoesDoDia().entradas.map((entrada) => (
                    <ListItem key={entrada.id} divider>
                      <ListItemText
                        primary={entrada.descricao}
                        secondary={entrada.categoria}
                      />
                      <Typography variant="body1" color="success.main">
                        {formatarMoedaDetalhado(entrada.valor)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('nenhumaEntradaRegistrada')}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              {/* Lista de saídas */}
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {t('saidas')}
              </Typography>
              
              {obterTransacoesDoDia().saidas.length > 0 ? (
                <List>
                  {obterTransacoesDoDia().saidas.map((saida) => (
                    <ListItem key={saida.id} divider>
                      <ListItemText
                        primary={saida.descricao}
                        secondary={saida.categoria}
                      />
                      <Typography variant="body1" color="error.main">
                        {formatarMoedaDetalhado(saida.valor)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('nenhumaSaidaRegistrada')}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              {/* Lista de pagamentos */}
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {t('pagamentos')}
              </Typography>
              
              {(obterTransacoesDoDia()?.pagamentosDoDia ?? []).length > 0 ? (
                <List>
                  {(obterTransacoesDoDia()?.pagamentosDoDia ?? []).map((pagamento) => (
                    <ListItem key={pagamento.id} divider>
                      <ListItemText
                        primary={pagamento.nome}
                        secondary={
                          <>
                            {pagamento.descricao}
                            <Chip 
                              size="small" 
                              label={pagamento.pago ? t('pago') : t('pendente')} 
                              color={pagamento.pago ? "success" : "warning"}
                              sx={{ ml: 1 }}
                            />
                          </>
                        }
                      />
                      <Typography variant="body1" color="error.main">
                        {formatarMoedaDetalhado(pagamento.valor)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('nenhumPagamentoRegistrado')}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleFecharDetalhes} color="primary">
            {t('fechar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendario; 