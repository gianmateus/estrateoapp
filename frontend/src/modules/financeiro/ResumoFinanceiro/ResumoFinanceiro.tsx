import React from 'react';
import { Box, Container, Grid, Paper, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Componentes
import KPICards from './KPICards';
import DonutChart from './DonutChart';
import TabelaComparativa from './TabelaComparativa';

// Dados demonstrativos - em um caso real, viriam da API
const DADOS_DEMO = {
  saldoAtual: 65842.75,
  totalEntradas: 42980.32,
  totalSaidas: 14514.57,
  mesAnterior: {
    saldoAtual: 37377.00,
    totalEntradas: 38450.65,
    totalSaidas: 15200.80
  },
  
  // Dados para os gráficos de categoria
  entradasPorCategoria: [
    { label: "Vendas", value: 27937.21 },
    { label: "Serviços", value: 8596.06 },
    { label: "Investimentos", value: 4298.03 },
    { label: "Outras", value: 2149.02 }
  ],
  
  saidasPorCategoria: [
    { label: "Fornecedores", value: 5805.83 },
    { label: "Folha", value: 4354.37 },
    { label: "Infraestrutura", value: 2177.19 },
    { label: "Impostos", value: 1741.75 },
    { label: "Outras", value: 435.43 }
  ]
};

const ResumoFinanceiro: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Calcular resultado do mês atual e anterior
  const resultadoMesAtual = DADOS_DEMO.totalEntradas - DADOS_DEMO.totalSaidas;
  const resultadoMesAnterior = 
    DADOS_DEMO.mesAnterior.totalEntradas - DADOS_DEMO.mesAnterior.totalSaidas;

  // Calcular variações percentuais
  const calcularVariacao = (atual: number, anterior: number): number => {
    return ((atual - anterior) / anterior) * 100;
  };

  // Dados para a tabela comparativa
  const dadosComparativos = [
    {
      indicador: t('resumoFinanceiro.totalEntradas'),
      mesAtual: DADOS_DEMO.totalEntradas,
      mesAnterior: DADOS_DEMO.mesAnterior.totalEntradas,
      variacao: calcularVariacao(
        DADOS_DEMO.totalEntradas, 
        DADOS_DEMO.mesAnterior.totalEntradas
      )
    },
    {
      indicador: t('resumoFinanceiro.totalSaidas'),
      mesAtual: DADOS_DEMO.totalSaidas,
      mesAnterior: DADOS_DEMO.mesAnterior.totalSaidas,
      variacao: calcularVariacao(
        DADOS_DEMO.totalSaidas,
        DADOS_DEMO.mesAnterior.totalSaidas
      )
    },
    {
      indicador: t('resumoFinanceiro.resultadoMes'),
      mesAtual: resultadoMesAtual,
      mesAnterior: resultadoMesAnterior,
      variacao: calcularVariacao(resultadoMesAtual, resultadoMesAnterior)
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 1, 
            fontWeight: 700,
            color: theme.palette.text.primary 
          }}
        >
          {t('resumoFinanceiro.titulo')}
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          {t('resumoFinanceiro.visaoGeralFinancas')}
        </Typography>

        {/* Cards KPI */}
        <KPICards
          saldoAtual={DADOS_DEMO.saldoAtual}
          totalEntradas={DADOS_DEMO.totalEntradas}
          totalSaidas={DADOS_DEMO.totalSaidas}
          mesAnterior={DADOS_DEMO.mesAnterior}
        />

        {/* Gráficos de Categorias */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <DonutChart 
              title={t('resumoFinanceiro.entradasPorCategoria')}
              data={DADOS_DEMO.entradasPorCategoria}
              type="income"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DonutChart 
              title={t('resumoFinanceiro.saidasPorCategoria')}
              data={DADOS_DEMO.saidasPorCategoria}
              type="expense"
            />
          </Grid>
        </Grid>

        {/* Tabela Comparativa */}
        <TabelaComparativa data={dadosComparativos} />
      </Box>
    </Container>
  );
};

export default ResumoFinanceiro; 