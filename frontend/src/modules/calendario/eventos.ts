import { TipoEvento } from './utils/coresEventos';
import { parseISO, isSameDay, isAfter, isBefore, format } from 'date-fns';
import Holidays from 'date-holidays';

// Interface para eventos do calendário
export interface EventoCalendario {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  tipo: TipoEvento;
  descricao?: string;
  valor?: number;
  categoria?: string;
  detalhes?: any; // Detalhes específicos do evento
}

// Interface para transação financeira
export interface Transacao {
  id: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  descricao: string;
  data: string; // formato ISO 8601
  categoria: string;
  realizado: boolean;
  notaFiscal?: string; // campo opcional para número da nota fiscal
}

// Interface para pagamento
export interface Pagamento {
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

// Interface para férias
export interface Ferias {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: string; // formato ISO 8601
  dataFim: string; // formato ISO 8601
  aprovado: boolean;
}

// Converter transações para eventos do calendário
export const transacoesParaEventos = (transacoes: Transacao[]): EventoCalendario[] => {
  return transacoes.map((transacao) => {
    const dataTransacao = parseISO(transacao.data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    let tipo: TipoEvento = 'futuro';
    if (isBefore(dataTransacao, hoje)) {
      tipo = 'vencido';
    } else if (isSameDay(dataTransacao, hoje)) {
      tipo = 'venceHoje';
    }
    
    return {
      id: `transacao_${transacao.id}`,
      title: `${transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}: ${transacao.descricao}`,
      start: dataTransacao,
      end: dataTransacao,
      allDay: true,
      tipo,
      descricao: transacao.descricao,
      valor: transacao.valor,
      categoria: transacao.categoria,
      detalhes: transacao
    };
  });
};

// Converter pagamentos para eventos do calendário
export const pagamentosParaEventos = (pagamentos: Pagamento[]): EventoCalendario[] => {
  return pagamentos.map((pagamento) => {
    const dataPagamento = parseISO(pagamento.vencimento);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    let tipo: TipoEvento = 'futuro';
    if (isBefore(dataPagamento, hoje) && !pagamento.pago) {
      tipo = 'vencido';
    } else if (isSameDay(dataPagamento, hoje) && !pagamento.pago) {
      tipo = 'venceHoje';
    } else if (pagamento.pago) {
      tipo = 'futuro';
    }
    
    return {
      id: `pagamento_${pagamento.id}`,
      title: `${pagamento.pago ? '[PAGO] ' : ''}${pagamento.nome}`,
      start: dataPagamento,
      end: dataPagamento,
      allDay: true,
      tipo,
      descricao: pagamento.descricao,
      valor: pagamento.valor,
      categoria: pagamento.categoria,
      detalhes: pagamento
    };
  });
};

// Converter férias para eventos do calendário
export const feriasParaEventos = (ferias: Ferias[]): EventoCalendario[] => {
  return ferias.map((f) => {
    const dataInicio = parseISO(f.dataInicio);
    const dataFim = parseISO(f.dataFim);
    
    return {
      id: `ferias_${f.id}`,
      title: `Férias: ${f.funcionarioNome}`,
      start: dataInicio,
      end: dataFim,
      allDay: true,
      tipo: 'ferias',
      descricao: `Férias de ${f.funcionarioNome}`,
      detalhes: f
    };
  });
};

// Obter feriados nacionais da Alemanha
export const obterFeriadosAlemanha = (ano: number): EventoCalendario[] => {
  const hd = new Holidays('DE');
  const feriados = hd.getHolidays(ano);
  
  return feriados.map((feriado, index) => {
    const dataFeriado = new Date(feriado.date);
    
    return {
      id: `feriado_${ano}_${index}`,
      title: feriado.name,
      start: dataFeriado,
      end: dataFeriado,
      allDay: true,
      tipo: 'feriado',
      descricao: feriado.name
    };
  });
};

// Combinar todos os eventos em uma única lista
export const combinarEventos = (
  transacoes: Transacao[],
  pagamentos: Pagamento[],
  ferias: Ferias[],
  ano: number
): EventoCalendario[] => {
  const eventosTransacoes = transacoesParaEventos(transacoes);
  const eventosPagamentos = pagamentosParaEventos(pagamentos);
  const eventosFerias = feriasParaEventos(ferias);
  const eventosFeriados = obterFeriadosAlemanha(ano);
  
  return [
    ...eventosTransacoes,
    ...eventosPagamentos,
    ...eventosFerias,
    ...eventosFeriados
  ];
}; 