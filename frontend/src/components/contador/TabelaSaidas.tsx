/**
 * Expenses table component used in the Contador (Accountant) module
 * Displays a list of financial expense transactions
 * 
 * Componente de tabela de saídas usado no módulo Contador
 * Exibe uma lista de transações financeiras de saída
 */
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper, 
  TablePagination,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interface for expense entry data
// Interface para dados de saídas financeiras
interface SaidaData {
  id: number;            // Unique identifier / Identificador único
  data: string;          // Transaction date (YYYY-MM-DD) / Data da transação (AAAA-MM-DD)
  fornecedor: string;    // Vendor/supplier name / Nome do fornecedor
  tipo: string;          // Expense type / Tipo de despesa
  valor: number;         // Transaction amount / Valor da transação
}

interface TabelaSaidasProps {
  data: SaidaData[];    // Array of expense entries / Array de saídas financeiras
}

/**
 * Expenses table component that displays a paginated list of expense entries
 * 
 * Componente de tabela de saídas que exibe uma lista paginada de saídas financeiras
 */
const TabelaSaidas: React.FC<TabelaSaidasProps> = ({ data }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
  /**
   * Formats currency value in Euro format
   * @param value Number to format
   * @returns Formatted string
   * 
   * Formata valor monetário no formato Euro
   * @param value Número a formatar
   * @returns String formatada
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };
  
  /**
   * Formats date from YYYY-MM-DD to localized date
   * @param dateString Date string in YYYY-MM-DD format
   * @returns Formatted date string
   * 
   * Formata data de AAAA-MM-DD para data localizada
   * @param dateString String de data no formato AAAA-MM-DD
   * @returns String de data formatada
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  return (
    <>
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('data')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('contador.fornecedor')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('contador.tipo')}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('valor')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{formatDate(row.data)}</TableCell>
                  <TableCell>{row.fornecedor}</TableCell>
                  <TableCell>{row.tipo}</TableCell>
                  <TableCell align="right" sx={{ color: '#f44336', fontWeight: 'medium' }}>
                    {formatCurrency(row.valor)}
                  </TableCell>
                </TableRow>
              ))}
              
            {/* Display empty row if no data */}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  {t('nenhumaSaidaRegistrada')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('of')} ${count}`}
      />
    </>
  );
};

export default TabelaSaidas; 