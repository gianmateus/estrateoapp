/**
 * Income table component used in the Contador (Accountant) module
 * Displays a list of financial income transactions
 * 
 * Componente de tabela de entradas usado no módulo Contador
 * Exibe uma lista de transações financeiras de entrada
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
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ptBR } from 'date-fns/locale';

// Interface for income entry data
// Interface para dados de entradas financeiras
interface EntradaData {
  id: number;            // Unique identifier / Identificador único
  data: string;          // Transaction date (YYYY-MM-DD) / Data da transação (AAAA-MM-DD)
  cliente: string;       // Customer name / Nome do cliente
  descricao: string;     // Transaction description / Descrição da transação
  valor: number;         // Transaction amount / Valor da transação
}

interface TabelaEntradasProps {
  data: EntradaData[];   // Array of income entries / Array de entradas financeiras
}

/**
 * Income table component that displays a paginated list of income entries
 * 
 * Componente de tabela de entradas que exibe uma lista paginada de entradas financeiras
 */
const TabelaEntradas: React.FC<TabelaEntradasProps> = ({ data }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
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
              <TableCell sx={{ fontWeight: 'bold' }}>{t('contadorData.cliente')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('descricao')}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('valor')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{formatDate(new Date(row.data))}</TableCell>
                  <TableCell>{row.cliente}</TableCell>
                  <TableCell>{row.descricao}</TableCell>
                  <TableCell align="right" sx={{ color: '#4caf50', fontWeight: 'medium' }}>
                    {formatCurrency(row.valor)}
                  </TableCell>
                </TableRow>
              ))}
              
            {/* Display empty row if no data */}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  {t('nenhumaEntradaRegistrada')}
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

export default TabelaEntradas; 