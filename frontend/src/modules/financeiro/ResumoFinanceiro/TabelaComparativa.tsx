import React from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  useTheme 
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface ComparativoItem {
  indicador: string;
  mesAtual: number;
  mesAnterior: number;
  variacao: number;
}

interface TabelaComparativaProps {
  data: ComparativoItem[];
}

const TabelaComparativa: React.FC<TabelaComparativaProps> = ({ data }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Formatador de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };

  // Formatador de percentual
  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <Box
      sx={{
        mt: 3,
        mb: 3
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            width: 4,
            height: 20,
            backgroundColor: theme.palette.primary.main,
            marginRight: 1,
            borderRadius: 1,
            display: 'inline-block'
          }
        }}
      >
        {t('resumoFinanceiro.comparativoFinanceiro')}
      </Typography>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>
                {t('resumoFinanceiro.indicador')}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {t('resumoFinanceiro.mesAtual')}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {t('resumoFinanceiro.mesAnterior')}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {t('resumoFinanceiro.variacao')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => {
              const isPositive = item.variacao >= 0;
              // Determinando o tipo de indicador para coloração específica
              const isExpense = item.indicador === t('resumoFinanceiro.totalSaidas');
              // Para despesas, negativo é bom (economia) e positivo é ruim (aumento de gastos)
              const isGood = isExpense ? !isPositive : isPositive;
              
              return (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      backgroundColor: theme.palette.action.hover 
                    },
                    '&:last-child td, &:last-child th': { 
                      border: 0 
                    }
                  }}
                >
                  <TableCell 
                    component="th" 
                    scope="row"
                    sx={{ fontWeight: 500 }}
                  >
                    {item.indicador}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.mesAtual)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.mesAnterior)}
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: isGood ? '#2E7D32' : '#C62828',
                      fontWeight: 500
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                      }}
                    >
                      {isPositive ? (
                        <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                      ) : (
                        <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                      )}
                      {formatPercent(item.variacao)}{' '}
                      {isPositive 
                        ? t('resumoFinanceiro.aumentou') 
                        : t('resumoFinanceiro.diminuiu')
                      }
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TabelaComparativa; 