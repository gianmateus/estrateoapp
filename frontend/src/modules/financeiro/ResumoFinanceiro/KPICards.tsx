/**
 * Componente KPICards - Cards principais do Resumo Financeiro
 * 
 * Exibe os KPIs financeiros em 4 cards:
 * - Saldo Atual
 * - Total de Entradas
 * - Total de Saídas
 * - Resultado do Mês (Lucro/Prejuízo)
 */

import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  useTheme 
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  AccountBalance as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';

interface KPICardsProps {
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
  // Opcional - dados do mês anterior para comparação
  mesAnterior?: {
    saldoAtual?: number;
    totalEntradas?: number;
    totalSaidas?: number;
  }
}

const KPICards: React.FC<KPICardsProps> = ({
  saldoAtual,
  totalEntradas,
  totalSaidas,
  mesAnterior = {}
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const locale = i18n.language;

  // Resultado do mês (lucro ou prejuízo)
  const resultadoMes = totalEntradas - totalSaidas;
  const isLucro = resultadoMes >= 0;
  
  // Formatador de moeda conforme o idioma
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };

  // Calculando percentual de variação em relação ao mês anterior
  const calcularVariacao = (atual: number, anterior?: number): [number, boolean] => {
    if (!anterior) return [0, true];
    const variacao = ((atual - anterior) / anterior) * 100;
    return [Math.abs(variacao), variacao >= 0];
  };

  // Variações percentuais
  const [varSaldo, isSaldoUp] = calcularVariacao(saldoAtual, mesAnterior.saldoAtual);
  const [varEntradas, isEntradasUp] = calcularVariacao(totalEntradas, mesAnterior.totalEntradas);
  const [varSaidas, isSaidasDown] = calcularVariacao(totalSaidas, mesAnterior.totalSaidas);
  const [varResultado, isResultadoUp] = calcularVariacao(
    resultadoMes, 
    mesAnterior.totalEntradas && mesAnterior.totalSaidas 
      ? mesAnterior.totalEntradas - mesAnterior.totalSaidas
      : undefined
  );

  // Nome do mês anterior - em produção isso seria dinâmico
  const mesAnteriorNome = "Abril";

  // Cores específicas conforme solicitação
  const COLORS = {
    saldoAtual: '#007BFF',      // Azul
    totalEntradas: '#28A745',   // Verde
    totalSaidas: '#DC3545',     // Vermelho
    lucro: '#28A745',           // Verde escuro
    prejuizo: '#DC3545'         // Vermelho
  };

  // Array com dados dos cartões
  const cards = [
    {
      title: t('resumoFinanceiro.saldoAtual'),
      value: formatCurrency(saldoAtual),
      icon: <MoneyIcon />,
      mainColor: COLORS.saldoAtual,
      variacao: varSaldo > 0 ? varSaldo.toFixed(1) : null,
      isPositiveVariacao: isSaldoUp,
      previousMonth: mesAnteriorNome
    },
    {
      title: t('resumoFinanceiro.totalEntradas'),
      value: formatCurrency(totalEntradas),
      icon: <TrendingUpIcon />,
      mainColor: COLORS.totalEntradas,
      variacao: varEntradas > 0 ? varEntradas.toFixed(1) : null,
      isPositiveVariacao: isEntradasUp,
      previousMonth: mesAnteriorNome
    },
    {
      title: t('resumoFinanceiro.totalSaidas'),
      value: formatCurrency(totalSaidas),
      icon: <TrendingDownIcon />,
      mainColor: COLORS.totalSaidas,
      variacao: varSaidas > 0 ? varSaidas.toFixed(1) : null,
      isPositiveVariacao: !isSaidasDown, // Para saídas, queremos que a queda seja positiva
      previousMonth: mesAnteriorNome
    },
    {
      title: t('resumoFinanceiro.resultadoMes'),
      value: formatCurrency(Math.abs(resultadoMes)),
      subtext: isLucro ? t('resumoFinanceiro.lucro') : t('resumoFinanceiro.prejuizo'),
      icon: <BarChartIcon />,
      mainColor: isLucro ? COLORS.lucro : COLORS.prejuizo,
      variacao: varResultado > 0 ? varResultado.toFixed(1) : null,
      isPositiveVariacao: isResultadoUp,
      previousMonth: mesAnteriorNome
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card 
            sx={{ 
              height: '100%', 
              boxShadow: theme.shadows[3],
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: theme.shadows[6],
                transform: 'translateY(-4px)'
              },
              borderRadius: 2,
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <Box 
              sx={{ 
                height: 8, 
                width: '100%', 
                backgroundColor: card.mainColor,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8
              }} 
            />
            
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary" 
                  sx={{ fontWeight: 500 }}
                >
                  {card.title}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: card.mainColor + '15',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    color: card.mainColor
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: card.mainColor,
                  mb: 0.5 
                }}
              >
                {card.value}
              </Typography>
              
              {card.subtext && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 500,
                    color: card.mainColor,
                    display: 'block',
                    mb: 1
                  }}
                >
                  {card.subtext}
                </Typography>
              )}
              
              {/* Indicador de comparação com mês anterior */}
              {card.variacao && (
                <Chip
                  size="small"
                  icon={card.isPositiveVariacao ? <ArrowUpIcon fontSize="small" /> : <ArrowDownIcon fontSize="small" />}
                  label={`${card.variacao}% ${card.isPositiveVariacao ? t('resumoFinanceiro.aumentou') : t('resumoFinanceiro.diminuiu')}`}
                  sx={{
                    backgroundColor: card.isPositiveVariacao ? '#E8F5E9' : '#FFEBEE',
                    color: card.isPositiveVariacao ? '#2E7D32' : '#C62828',
                    marginTop: 1,
                    '& .MuiChip-icon': {
                      color: 'inherit'
                    },
                    fontSize: '0.75rem',
                    height: 24
                  }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KPICards; 