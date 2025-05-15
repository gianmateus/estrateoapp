/**
 * Componente MonthComparison - Comparação com mês anterior
 * 
 * Exibe uma tabela comparativa entre o mês atual e o anterior com:
 * - Valores de mês atual e anterior
 * - Variação em porcentagem
 * - Indicadores visuais de alta/baixa
 */

import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  useTheme, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon 
} from '@mui/icons-material';

interface ComparisonData {
  entradas: {
    mesAtual: number;
    mesAnterior: number;
  };
  saidas: {
    mesAtual: number;
    mesAnterior: number;
  };
  lucro: {
    mesAtual: number;
    mesAnterior: number;
  };
}

interface MonthComparisonProps {
  dados: ComparisonData;
}

const MonthComparison: React.FC<MonthComparisonProps> = ({
  dados
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const locale = i18n.language;
  
  // Formatador de moeda conforme o idioma
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };

  // Cálculo de variação percentual
  const calcularVariacao = (atual: number, anterior: number): number => {
    if (anterior === 0) return atual > 0 ? 100 : 0;
    return ((atual - anterior) / Math.abs(anterior)) * 100;
  };

  // Formatador de porcentagem
  const formatarPorcentagem = (valor: number): string => {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(valor / 100);
  };

  // Dados para a tabela
  const tableData = [
    {
      title: t('resumoFinanceiro.totalEntradas'),
      mesAtual: dados.entradas.mesAtual,
      mesAnterior: dados.entradas.mesAnterior,
      variacao: calcularVariacao(dados.entradas.mesAtual, dados.entradas.mesAnterior)
    },
    {
      title: t('resumoFinanceiro.totalSaidas'),
      mesAtual: dados.saidas.mesAtual,
      mesAnterior: dados.saidas.mesAnterior,
      variacao: calcularVariacao(dados.saidas.mesAtual, dados.saidas.mesAnterior),
      // Para despesas, crescimento é ruim (cor vermelha) e redução é bom (cor verde)
      inverterCores: true
    },
    {
      title: t('resumoFinanceiro.resultadoMes'),
      mesAtual: dados.lucro.mesAtual,
      mesAnterior: dados.lucro.mesAnterior,
      variacao: calcularVariacao(dados.lucro.mesAtual, dados.lucro.mesAnterior)
    }
  ];

  return (
    <Card sx={{ boxShadow: theme.shadows[3], borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {t('resumoFinanceiro.comparacaoMesAnterior')}
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                '& th': { 
                  fontWeight: 600, 
                  backgroundColor: theme.palette.background.default 
                } 
              }}>
                <TableCell>{''}</TableCell>
                <TableCell>{t('resumoFinanceiro.mesAtual')}</TableCell>
                <TableCell>{t('resumoFinanceiro.mesAnterior')}</TableCell>
                <TableCell>{t('resumoFinanceiro.variacao')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => {
                const isPositiveVariation = row.variacao > 0;
                
                // Determinar se a variação é positiva considerando se é entrada ou saída
                // Para saídas, uma redução (variação negativa) é considerada positiva
                const isBeneficial = row.inverterCores 
                  ? !isPositiveVariation 
                  : isPositiveVariation;
                
                const variacaoColor = isBeneficial 
                  ? theme.palette.success.main 
                  : theme.palette.error.main;
                
                return (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {row.title}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.mesAtual)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.mesAnterior)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: variacaoColor,
                        fontWeight: 500
                      }}>
                        {isPositiveVariation ? (
                          <TrendingUpIcon sx={{ mr: 0.5 }} fontSize="small" />
                        ) : (
                          <TrendingDownIcon sx={{ mr: 0.5 }} fontSize="small" />
                        )}
                        {formatarPorcentagem(Math.abs(row.variacao))}
                        <Typography 
                          component="span" 
                          variant="body2" 
                          sx={{ ml: 0.5, fontWeight: 500 }}
                        >
                          {isPositiveVariation 
                            ? t('resumoFinanceiro.aumentou') 
                            : t('resumoFinanceiro.diminuiu')}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default MonthComparison; 