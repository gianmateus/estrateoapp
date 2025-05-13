import React, { useMemo } from 'react';
import { Box, Grid, Typography, Paper, Divider, Chip, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFinanceiro } from '../../contexts/FinanceiroContext';
import { format, startOfMonth, endOfMonth, isAfter, isBefore, parseISO, getDaysInMonth, addMonths, differenceInMonths } from 'date-fns';
import { ptBR, enUS, de } from 'date-fns/locale';
import CardResumo from './componentes/CardResumo';
import GraficoPizza from './componentes/GraficoPizza';
import GraficoLinhaSaldo from './componentes/GraficoLinhaSaldo';

/**
 * Componente principal de Resumo Financeiro
 * Exibe os principais KPIs financeiros e gráficos
 * 
 * @returns Componente de Resumo Financeiro
 */
const ResumoFinanceiro: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { transacoes, balanco } = useFinanceiro();
  const theme = useTheme();

  // Obtém o locale correto com base no idioma atual
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

  // Formatar valor para exibir em euros (padrão europeu)
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };
  
  // Obtém o mês atual e os meses anteriores para comparação
  const mesAtual = useMemo(() => new Date(), []);
  const inicioMesAtual = useMemo(() => startOfMonth(mesAtual), [mesAtual]);
  const fimMesAtual = useMemo(() => endOfMonth(mesAtual), [mesAtual]);
  
  const mesAnterior = useMemo(() => addMonths(mesAtual, -1), [mesAtual]);
  const inicioMesAnterior = useMemo(() => startOfMonth(mesAnterior), [mesAnterior]);
  const fimMesAnterior = useMemo(() => endOfMonth(mesAnterior), [mesAnterior]);

  // Calcular valores para o mês atual
  const dadosMesAtual = useMemo(() => {
    const transacoesMesAtual = transacoes.filter(t => {
      const dataTransacao = parseISO(t.data);
      return !isBefore(dataTransacao, inicioMesAtual) && !isAfter(dataTransacao, fimMesAtual);
    });

    let totalEntradas = 0;
    let totalSaidas = 0;
    
    const categoriaEntradas: Record<string, number> = {};
    const categoriaSaidas: Record<string, number> = {};
    
    // Calcular totais e categorias
    transacoesMesAtual.forEach(t => {
      if (t.tipo === 'entrada') {
        totalEntradas += t.valor;
        categoriaEntradas[t.categoria] = (categoriaEntradas[t.categoria] || 0) + t.valor;
      } else {
        totalSaidas += t.valor;
        categoriaSaidas[t.categoria] = (categoriaSaidas[t.categoria] || 0) + t.valor;
      }
    });

    return {
      transacoes: transacoesMesAtual,
      totalEntradas,
      totalSaidas,
      resultado: totalEntradas - totalSaidas,
      categoriaEntradas,
      categoriaSaidas
    };
  }, [transacoes, inicioMesAtual, fimMesAtual]);

  // Calcular valores para o mês anterior
  const dadosMesAnterior = useMemo(() => {
    const transacoesMesAnterior = transacoes.filter(t => {
      const dataTransacao = parseISO(t.data);
      return !isBefore(dataTransacao, inicioMesAnterior) && !isAfter(dataTransacao, fimMesAnterior);
    });

    let totalEntradas = 0;
    let totalSaidas = 0;
    
    // Calcular totais
    transacoesMesAnterior.forEach(t => {
      if (t.tipo === 'entrada') {
        totalEntradas += t.valor;
      } else {
        totalSaidas += t.valor;
      }
    });

    return {
      totalEntradas,
      totalSaidas,
      resultado: totalEntradas - totalSaidas
    };
  }, [transacoes, inicioMesAnterior, fimMesAnterior]);

  // Calcular percentuais de comparação
  const comparacoes = useMemo(() => {
    const calcularVariacao = (atual: number, anterior: number) => {
      if (anterior === 0) return atual > 0 ? 100 : 0;
      return ((atual - anterior) / anterior) * 100;
    };

    return {
      entradas: calcularVariacao(dadosMesAtual.totalEntradas, dadosMesAnterior.totalEntradas),
      saidas: calcularVariacao(dadosMesAtual.totalSaidas, dadosMesAnterior.totalSaidas),
      resultado: calcularVariacao(dadosMesAtual.resultado, dadosMesAnterior.resultado)
    };
  }, [dadosMesAtual, dadosMesAnterior]);

  // Dados para gráfico de pizza de entradas
  const dadosGraficoEntradas = useMemo(() => {
    return Object.entries(dadosMesAtual.categoriaEntradas).map(([categoria, valor]) => ({
      name: categoria,
      value: valor
    }));
  }, [dadosMesAtual.categoriaEntradas]);

  // Dados para gráfico de pizza de saídas
  const dadosGraficoSaidas = useMemo(() => {
    return Object.entries(dadosMesAtual.categoriaSaidas).map(([categoria, valor]) => ({
      name: categoria,
      value: valor
    }));
  }, [dadosMesAtual.categoriaSaidas]);

  // Dados para gráfico de linha de saldo diário
  const dadosGraficoSaldo = useMemo(() => {
    const diasNoMes = getDaysInMonth(mesAtual);
    const dadosDiarios = [];
    
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia);
      const dataFormatada = format(data, 'dd/MM');
      
      // Filtrar transações até esta data do mês
      const transacoesAteDia = transacoes.filter(t => {
        const dataTransacao = parseISO(t.data);
        return (
          dataTransacao.getMonth() === mesAtual.getMonth() &&
          dataTransacao.getFullYear() === mesAtual.getFullYear() &&
          dataTransacao.getDate() <= dia
        );
      });
      
      // Calcular saldo para este dia
      let saldoDia = 0;
      transacoesAteDia.forEach(t => {
        if (t.tipo === 'entrada') {
          saldoDia += t.valor;
        } else {
          saldoDia -= t.valor;
        }
      });
      
      dadosDiarios.push({
        data: dataFormatada,
        saldo: saldoDia
      });
    }
    
    return dadosDiarios;
  }, [transacoes, mesAtual]);

  const nomeMesAtual = useMemo(() => {
    return format(mesAtual, 'MMMM yyyy', { locale: getDateLocale() });
  }, [mesAtual, i18n.language]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
        {t('resumoFinanceiro')}
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
        {t('visaoGeralFinancas')}
      </Typography>
      
      {/* Cards principais de KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CardResumo
            titulo={t('saldoAtual')}
            valor={formatarMoeda(balanco.saldoAtual)}
            icone="saldo"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardResumo
            titulo={t('totalEntradas')}
            valor={formatarMoeda(dadosMesAtual.totalEntradas)}
            icone="entrada"
            percentual={comparacoes.entradas}
            textoVariacao={comparacoes.entradas >= 0 ? t('aumentou') as string : t('diminuiu') as string}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardResumo
            titulo={t('totalSaidas')}
            valor={formatarMoeda(dadosMesAtual.totalSaidas)}
            icone="saida"
            percentual={comparacoes.saidas}
            textoVariacao={comparacoes.saidas >= 0 ? t('aumentou') as string : t('diminuiu') as string}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardResumo
            titulo={t('resultadoMes')}
            valor={formatarMoeda(dadosMesAtual.resultado)}
            icone="resultado"
            percentual={comparacoes.resultado}
            textoVariacao={comparacoes.resultado >= 0 ? t('aumentou') as string : t('diminuiu') as string}
          />
        </Grid>
      </Grid>

      {/* Seção de gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <GraficoLinhaSaldo
            titulo={t('variacaoSaldoDiario')}
            dados={dadosGraficoSaldo}
            altura={340}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {/* Gráficos de pizza */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <GraficoPizza
                titulo={t('entradasPorCategoria')}
                dados={dadosGraficoEntradas}
                altura={160}
                cores={[theme.palette.success.light, theme.palette.success.main, theme.palette.success.dark]}
              />
            </Grid>
            <Grid item xs={12}>
              <GraficoPizza
                titulo={t('saidasPorCategoria')}
                dados={dadosGraficoSaidas}
                altura={160}
                cores={[theme.palette.error.light, theme.palette.error.main, theme.palette.error.dark]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Comparação com mês anterior */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('comparacaoMesAnterior')}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body1">{t('entradas')}</Typography>
              <Box>
                <Chip 
                  label={`${Math.abs(comparacoes.entradas).toFixed(1)}% ${comparacoes.entradas >= 0 ? '↑' : '↓'}`}
                  sx={{ 
                    bgcolor: comparacoes.entradas >= 0 ? 'success.light' : 'error.light',
                    color: comparacoes.entradas >= 0 ? 'success.dark' : 'error.dark',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">{format(mesAnterior, 'MMM', { locale: getDateLocale() })}</Typography>
              <Typography variant="body2">{formatarMoeda(dadosMesAnterior.totalEntradas)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">{format(mesAtual, 'MMM', { locale: getDateLocale() })}</Typography>
              <Typography variant="body2" fontWeight="bold">{formatarMoeda(dadosMesAtual.totalEntradas)}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body1">{t('saidas')}</Typography>
              <Box>
                <Chip 
                  label={`${Math.abs(comparacoes.saidas).toFixed(1)}% ${comparacoes.saidas >= 0 ? '↑' : '↓'}`}
                  sx={{ 
                    bgcolor: comparacoes.saidas >= 0 ? 'error.light' : 'success.light',
                    color: comparacoes.saidas >= 0 ? 'error.dark' : 'success.dark',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">{format(mesAnterior, 'MMM', { locale: getDateLocale() })}</Typography>
              <Typography variant="body2">{formatarMoeda(dadosMesAnterior.totalSaidas)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">{format(mesAtual, 'MMM', { locale: getDateLocale() })}</Typography>
              <Typography variant="body2" fontWeight="bold">{formatarMoeda(dadosMesAtual.totalSaidas)}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body1">
                {dadosMesAtual.resultado >= 0 ? t('lucro') : t('prejuizo')}
              </Typography>
              <Box>
                <Chip 
                  label={`${Math.abs(comparacoes.resultado).toFixed(1)}% ${comparacoes.resultado >= 0 ? '↑' : '↓'}`}
                  sx={{ 
                    bgcolor: (dadosMesAtual.resultado >= 0 && comparacoes.resultado >= 0) || (dadosMesAtual.resultado < 0 && comparacoes.resultado < 0) ? 'success.light' : 'error.light',
                    color: (dadosMesAtual.resultado >= 0 && comparacoes.resultado >= 0) || (dadosMesAtual.resultado < 0 && comparacoes.resultado < 0) ? 'success.dark' : 'error.dark',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">{format(mesAnterior, 'MMM', { locale: getDateLocale() })}</Typography>
              <Typography variant="body2">{formatarMoeda(dadosMesAnterior.resultado)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">{format(mesAtual, 'MMM', { locale: getDateLocale() })}</Typography>
              <Typography variant="body2" fontWeight="bold">{formatarMoeda(dadosMesAtual.resultado)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ResumoFinanceiro; 