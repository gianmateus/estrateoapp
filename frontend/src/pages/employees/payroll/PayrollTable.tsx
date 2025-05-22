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
  Chip,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AccessTime as PendingIcon,
  CheckCircle as PaidIcon,
  ErrorOutline as OverdueIcon,
  Info as InfoIcon
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

  // Renderização do status com badge visual
  const renderizarStatus = (status: 'pago' | 'pendente' | 'atrasado', id: string) => {
    let color: 'success' | 'warning' | 'error' = 'warning';
    let icon = <PendingIcon fontSize="small" />;
    let label = 'Pendente';
    
    if (status === 'pago') {
      color = 'success';
      icon = <PaidIcon fontSize="small" />;
      label = 'Pago';
    } else if (status === 'atrasado') {
      color = 'error';
      icon = <OverdueIcon fontSize="small" />;
      label = 'Atrasado';
    }
    
    return (
      <Chip
        icon={icon}
        label={label}
        color={color}
        variant="outlined"
        size="small"
        onClick={() => onToggleStatus(id)}
        sx={{ minWidth: '110px' }}
      />
    );
  };

  // Renderização do tipo de contrato
  const renderizarTipoContrato = (tipo: 'mensalista' | 'horista') => {
    return (
      <Chip 
        label={tipo === 'mensalista' ? 'Mensalista' : 'Horista'} 
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
            <TableCell>Funcionário</TableCell>
            <TableCell>Tipo de Contrato</TableCell>
            <TableCell align="center">Horas Trabalhadas</TableCell>
            <TableCell align="center">Valor Bruto</TableCell>
            <TableCell align="center">Descontos</TableCell>
            <TableCell align="center">Valor Líquido</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <InfoIcon color="info" fontSize="large" />
                  <Typography variant="body1" color="text.secondary">
                    Nenhum pagamento encontrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tente mudar os filtros ou adicione um novo pagamento
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.employeeName}</TableCell>
                <TableCell>{renderizarTipoContrato(payment.contractType)}</TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {payment.hoursWorked}h
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {formatarMoeda(payment.grossAmount)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium" color="error.main">
                    {formatarMoeda(payment.deductions)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {formatarMoeda(payment.netAmount)}
                  </Typography>
                </TableCell>
                <TableCell align="center">{renderizarStatus(payment.status, payment.id)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Visualizar">
                      <IconButton size="small" color="info">
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => onEditPayment(payment)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
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