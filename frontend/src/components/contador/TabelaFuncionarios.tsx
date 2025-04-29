/**
 * Employees table component used in the Contador (Accountant) module
 * Displays a list of employees with payment information
 * 
 * Componente de tabela de funcionários usado no módulo Contador
 * Exibe uma lista de funcionários com informações de pagamento
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
  useTheme,
  Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Interface for employee data
// Interface para dados de funcionários
interface FuncionarioData {
  id: number;                // Unique identifier / Identificador único
  nome: string;              // Employee name / Nome do funcionário
  tipoContrato: string;      // Contract type / Tipo de contrato
  horasTrabalhadas: number;  // Hours worked / Horas trabalhadas
  valorPago: number;         // Amount paid / Valor pago
}

interface TabelaFuncionariosProps {
  data: FuncionarioData[];   // Array of employee data / Array de dados de funcionários
}

/**
 * Employees table component that displays a paginated list of employees with payment info
 * 
 * Componente de tabela de funcionários que exibe uma lista paginada de funcionários com informações de pagamento
 */
const TabelaFuncionarios: React.FC<TabelaFuncionariosProps> = ({ data }) => {
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
   * Returns color for contract type chip
   * @param type Contract type
   * @returns Color string for the chip
   * 
   * Retorna cor para o chip de tipo de contrato
   * @param type Tipo de contrato
   * @returns String de cor para o chip
   */
  const getContractTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'clt':
        return '#2196f3'; // blue
      case 'pj':
        return '#ff9800'; // orange
      case 'estagiário':
        return '#4caf50'; // green
      case 'terceirizado':
        return '#9c27b0'; // purple
      default:
        return '#757575'; // gray
    }
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
              <TableCell sx={{ fontWeight: 'bold' }}>{t('nome')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('contadorData.tipoContrato')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('contadorData.horasTrabalhadas')}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('contadorData.valorPago')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.nome}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.tipoContrato}
                      size="small"
                      sx={{ 
                        backgroundColor: getContractTypeColor(row.tipoContrato),
                        color: 'white',
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">{row.horasTrabalhadas}h</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                    {formatCurrency(row.valorPago)}
                  </TableCell>
                </TableRow>
              ))}
              
            {/* Display empty row if no data */}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  {t('nenhumPagamentoRegistrado')}
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

export default TabelaFuncionarios; 