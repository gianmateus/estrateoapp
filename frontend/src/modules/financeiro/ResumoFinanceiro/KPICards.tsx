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
  useTheme 
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  AccountBalance as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon 
} from '@mui/icons-material';

interface KPICardsProps {
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
}

const KPICards: React.FC<KPICardsProps> = ({
  saldoAtual,
  totalEntradas,
  totalSaidas
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

  // Array com dados dos cartões
  const cards = [
    {
      title: t('resumoFinanceiro.saldoAtual'),
      value: formatCurrency(saldoAtual),
      icon: <MoneyIcon />,
      variant: 'primary',
      bgColor: theme.palette.primary.main + '15', // Transparência 15%
      iconColor: theme.palette.primary.main
    },
    {
      title: t('resumoFinanceiro.totalEntradas'),
      value: formatCurrency(totalEntradas),
      icon: <TrendingUpIcon />,
      variant: 'success',
      bgColor: theme.palette.success.main + '15',
      iconColor: theme.palette.success.main
    },
    {
      title: t('resumoFinanceiro.totalSaidas'),
      value: formatCurrency(totalSaidas),
      icon: <TrendingDownIcon />,
      variant: 'error',
      bgColor: theme.palette.error.main + '15',
      iconColor: theme.palette.error.main
    },
    {
      title: t('resumoFinanceiro.resultadoMes'),
      value: formatCurrency(Math.abs(resultadoMes)),
      subtext: isLucro ? t('resumoFinanceiro.lucro') : t('resumoFinanceiro.prejuizo'),
      icon: <BarChartIcon />,
      variant: isLucro ? 'success' : 'error',
      bgColor: (isLucro ? theme.palette.success.main : theme.palette.error.main) + '15',
      iconColor: isLucro ? theme.palette.success.main : theme.palette.error.main
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
              borderRadius: 2
            }}
          >
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
                    backgroundColor: card.bgColor,
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    color: card.iconColor
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: card.iconColor,
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
                    color: card.iconColor,
                  }}
                >
                  {card.subtext}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KPICards; 