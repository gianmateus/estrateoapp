import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  Button,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PaymentData } from './PayrollPage';

interface PayrollTableProps {
  payments: PaymentData[];
  loading: boolean;
  onEditPayment: (payment: PaymentData) => void;
  onToggleStatus: (id: string) => void;
}

const PayrollTable: React.FC<PayrollTableProps> = ({
  payments,
  loading,
  onEditPayment,
  onToggleStatus
}) => {
  const { t } = useTranslation();

  // Formatação de moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };

  // Renderização do status
  const renderizarStatus = (status: 'pago' | 'pendente', id: string) => {
    const isPago = status === 'pago';
    
    return (
      <Button
        variant="contained"
        size="small"
        color={isPago ? 'success' : 'error'}
        startIcon={isPago ? <CheckIcon /> : <CancelIcon />}
        onClick={() => onToggleStatus(id)}
        sx={{ minWidth: '110px' }}
      >
        {isPago ? t('pago') : t('pendente')}
      </Button>
    );
  };

  // Renderização do tipo de contrato
  const renderizarTipoContrato = (tipo: 'mensalista' | 'horista') => {
    return (
      <Chip 
        label={tipo === 'mensalista' ? t('mensalista') : t('horista')} 
        color={tipo === 'mensalista' ? 'primary' : 'secondary'}
        size="small"
        variant="outlined"
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('funcionario')}</TableCell>
            <TableCell>{t('tipoContrato')}</TableCell>
            <TableCell>{t('horasTrabalhadas')}</TableCell>
            <TableCell>{t('valorBruto')}</TableCell>
            <TableCell>{t('descontos')}</TableCell>
            <TableCell>{t('valorLiquido')}</TableCell>
            <TableCell>{t('status')}</TableCell>
            <TableCell align="center">{t('acoes')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">{t('nenhumPagamentoEncontrado')}</TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.employeeName}</TableCell>
                <TableCell>{renderizarTipoContrato(payment.contractType)}</TableCell>
                <TableCell>{payment.hoursWorked}h</TableCell>
                <TableCell>{formatarMoeda(payment.grossAmount)}</TableCell>
                <TableCell>{formatarMoeda(payment.deductions)}</TableCell>
                <TableCell>{formatarMoeda(payment.netAmount)}</TableCell>
                <TableCell>{renderizarStatus(payment.status, payment.id)}</TableCell>
                <TableCell align="center">
                  <Tooltip title={t('visualizar')}>
                    <IconButton size="small">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('editar')}>
                    <IconButton size="small" onClick={() => onEditPayment(payment)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PayrollTable;