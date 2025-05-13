import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
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
  Chip,
  useTheme
} from '@mui/material';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parseISO, getYear, addMonths } from 'date-fns';
import { ptBR, enUS, de } from 'date-fns/locale';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment/locale/de';

import { EventoCalendario, Transacao, Pagamento, Ferias, combinarEventos } from './eventos';
import { getCoresEventos, TipoEvento } from './utils/coresEventos';

// Mock de dados para férias (simulação)
const mockFerias: Ferias[] = [
  {
    id: '1',
    funcionarioId: 'func1',
    funcionarioNome: 'João Silva',
    dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString(),
    dataFim: new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString(),
    aprovado: true
  },
  {
    id: '2',
    funcionarioId: 'func2',
    funcionarioNome: 'Maria Santos',
    dataInicio: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString(),
    dataFim: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString(),
    aprovado: true
  }
];

// Função para obter localização de data com base no idioma
const getDateLocale = (lang: string) => {
  switch(lang) {
    case 'de': return de;
    case 'en': return enUS;
    default: return ptBR;
  }
};

const CalendarioFinanceiro = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const coresEventos = getCoresEventos(theme);
  
  // Estados
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [ferias, setFerias] = useState<Ferias[]>(mockFerias);
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoCalendario | null>(null);
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [dataAtual, setDataAtual] = useState(new Date());
  
  // Configurar o locale do moment com base no idioma atual
  useEffect(() => {
    const currentLanguage = i18n.language;
    moment.locale(currentLanguage === 'pt-BR' ? 'pt-br' : (currentLanguage === 'de' ? 'de' : 'en'));
  }, [i18n.language]);
  
  // Localizer para o react-big-calendar
  const localizer = useMemo(() => {
    return momentLocalizer(moment);
  }, []);

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
    },
    {
      id: '4',
      nome: 'Imposto mensal',
      valor: 1200,
      categoria: 'impostos',
      vencimento: new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString(),
      recorrencia: 'mensal',
      pago: false,
      createdAt: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    },
    {
      id: '5',
      nome: 'Pagamento de funcionários',
      valor: 4500,
      categoria: 'salarios',
      vencimento: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString(),
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
        setFerias(mockFerias);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  // Atualizar eventos quando os dados mudam
  useEffect(() => {
    const anoAtual = getYear(dataAtual);
    const eventosAtualizados = combinarEventos(transacoes, pagamentos, ferias, anoAtual);
    setEventos(eventosAtualizados);
  }, [transacoes, pagamentos, ferias, dataAtual]);

  // Formatação para moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };

  // Estilos personalizados para os eventos no calendário
  const eventStyleGetter = (evento: EventoCalendario) => {
    const estilo = coresEventos[evento.tipo as TipoEvento] || coresEventos.futuro;
    
    return {
      style: {
        backgroundColor: estilo.backgroundColor,
        color: estilo.color,
        borderRadius: '4px',
        border: `1px solid ${estilo.borderColor}`,
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '0.85rem',
        padding: '2px 4px'
      }
    };
  };

  // Manipular clique em evento
  const handleSelecionarEvento = (evento: EventoCalendario) => {
    setEventoSelecionado(evento);
    setDetalhesAberto(true);
  };

  // Fechar modal de detalhes
  const handleFecharDetalhes = () => {
    setDetalhesAberto(false);
    setEventoSelecionado(null);
  };

  // Navegar para outro mês/ano
  const handleNavigate = (date: Date) => {
    setDataAtual(date);
  };

  // Renderizar conteúdo do modal de detalhes baseado no tipo de evento
  const renderizarDetalhesEvento = () => {
    if (!eventoSelecionado) return null;

    const id = eventoSelecionado.id;
    
    if (id.startsWith('transacao_')) {
      const transacao = eventoSelecionado.detalhes as Transacao;
      return (
        <>
          <Typography variant="h6" gutterBottom>
            {transacao.tipo === 'entrada' ? t('detalhesEntrada') : t('detalhesSaida')}
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary={t('descricao')} 
                secondary={transacao.descricao} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('valor')} 
                secondary={formatarMoeda(transacao.valor)} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('categoria')} 
                secondary={transacao.categoria} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('data')} 
                secondary={format(parseISO(transacao.data), 'PPP', { locale: getDateLocale(i18n.language) })} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('status')} 
                secondary={
                  <Chip 
                    size="small" 
                    label={transacao.realizado ? t('realizado') : t('pendente')} 
                    color={transacao.realizado ? "success" : "warning"}
                  />
                } 
              />
            </ListItem>
            {transacao.notaFiscal && (
              <>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary={t('notaFiscal')} 
                    secondary={transacao.notaFiscal} 
                  />
                </ListItem>
              </>
            )}
          </List>
        </>
      );
    } else if (id.startsWith('pagamento_')) {
      const pagamento = eventoSelecionado.detalhes as Pagamento;
      return (
        <>
          <Typography variant="h6" gutterBottom>
            {t('detalhesPagamento')}
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary={t('nome')} 
                secondary={pagamento.nome} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('valor')} 
                secondary={formatarMoeda(pagamento.valor)} 
              />
            </ListItem>
            <Divider />
            {pagamento.descricao && (
              <>
                <ListItem>
                  <ListItemText 
                    primary={t('descricao')} 
                    secondary={pagamento.descricao} 
                  />
                </ListItem>
                <Divider />
              </>
            )}
            <ListItem>
              <ListItemText 
                primary={t('categoria')} 
                secondary={pagamento.categoria} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('dataVencimento')} 
                secondary={format(parseISO(pagamento.vencimento), 'PPP', { locale: getDateLocale(i18n.language) })} 
              />
            </ListItem>
            <Divider />
            {pagamento.notaFiscal && (
              <>
                <ListItem>
                  <ListItemText 
                    primary={t('notaFiscal')} 
                    secondary={pagamento.notaFiscal} 
                  />
                </ListItem>
                <Divider />
              </>
            )}
            <ListItem>
              <ListItemText 
                primary={t('recorrencia')} 
                secondary={t(`recorrencia_${pagamento.recorrencia}`)} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('status')} 
                secondary={
                  <Chip 
                    size="small" 
                    label={pagamento.pago ? t('pago') : t('pendente')} 
                    color={pagamento.pago ? "success" : "warning"}
                  />
                } 
              />
            </ListItem>
          </List>
        </>
      );
    } else if (id.startsWith('ferias_')) {
      const ferias = eventoSelecionado.detalhes as Ferias;
      return (
        <>
          <Typography variant="h6" gutterBottom>
            {t('detalhesFerias')}
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary={t('funcionario')} 
                secondary={ferias.funcionarioNome} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('dataInicio')} 
                secondary={format(parseISO(ferias.dataInicio), 'PPP', { locale: getDateLocale(i18n.language) })} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('dataFim')} 
                secondary={format(parseISO(ferias.dataFim), 'PPP', { locale: getDateLocale(i18n.language) })} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('status')} 
                secondary={
                  <Chip 
                    size="small" 
                    label={ferias.aprovado ? t('aprovado') : t('pendente')} 
                    color={ferias.aprovado ? "success" : "warning"}
                  />
                } 
              />
            </ListItem>
          </List>
        </>
      );
    } else if (id.startsWith('feriado_')) {
      return (
        <>
          <Typography variant="h6" gutterBottom>
            {t('detalhesFeriado')}
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary={t('nome')} 
                secondary={eventoSelecionado.title} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('data')} 
                secondary={format(eventoSelecionado.start, 'PPP', { locale: getDateLocale(i18n.language) })} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary={t('tipo')} 
                secondary={t('feriado')} 
              />
            </ListItem>
          </List>
        </>
      );
    }
    
    return null;
  };

  // Mensagens personalizadas para o calendário
  const messages = useMemo(() => ({
    today: t('hoje'),
    previous: t('anterior'),
    next: t('proximo'),
    month: t('mes'),
    week: t('semana'),
    day: t('dia'),
    agenda: t('agenda'),
    date: t('data'),
    time: t('hora'),
    event: t('evento'),
    allDay: t('diaInteiro'),
    noEventsInRange: t('nenhumEventoNoPeriodo')
  }), [t]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('calendarioFinanceiro')}
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {format(dataAtual, 'MMMM yyyy', { locale: getDateLocale(i18n.language) })}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => handleNavigate(addMonths(dataAtual, -1))}
            >
              {t('mesAnterior')}
            </Button>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => handleNavigate(new Date())}
            >
              {t('hoje')}
            </Button>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => handleNavigate(addMonths(dataAtual, 1))}
            >
              {t('proximoMes')}
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('legenda')}:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              size="small"
              sx={{ 
                backgroundColor: coresEventos.vencido.backgroundColor,
                color: coresEventos.vencido.color
              }}
              label={t('vencido')}
            />
            <Chip
              size="small"
              sx={{ 
                backgroundColor: coresEventos.venceHoje.backgroundColor,
                color: coresEventos.venceHoje.color
              }}
              label={t('venceHoje')}
            />
            <Chip
              size="small"
              sx={{ 
                backgroundColor: coresEventos.futuro.backgroundColor,
                color: coresEventos.futuro.color
              }}
              label={t('futuro')}
            />
            <Chip
              size="small"
              sx={{ 
                backgroundColor: coresEventos.feriado.backgroundColor,
                color: coresEventos.feriado.color
              }}
              label={t('feriados')}
            />
            <Chip
              size="small"
              sx={{ 
                backgroundColor: coresEventos.ferias.backgroundColor,
                color: coresEventos.ferias.color
              }}
              label={t('ferias')}
            />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 700 }}>
            <Calendar
              localizer={localizer}
              events={eventos}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              defaultView={Views.MONTH}
              defaultDate={dataAtual}
              date={dataAtual}
              onNavigate={handleNavigate}
              onSelectEvent={handleSelecionarEvento}
              eventPropGetter={eventStyleGetter}
              messages={messages}
              popup
              tooltipAccessor={(event: EventoCalendario) => event.descricao || event.title}
            />
          </Box>
        )}
      </Paper>

      {/* Modal de detalhes do evento */}
      <Dialog
        open={detalhesAberto}
        onClose={handleFecharDetalhes}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {eventoSelecionado?.title}
        </DialogTitle>
        
        <DialogContent dividers>
          {renderizarDetalhesEvento()}
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

export default CalendarioFinanceiro; 