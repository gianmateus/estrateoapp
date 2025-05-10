/**
 * Badge de status de impostos
 * Exibe um indicador visual do status do imposto (pago, devido, em atraso, etc.)
 */
import React from 'react';
import { Chip, Typography, Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TaxStatus } from '../../types/tax';

interface TaxStatusBadgeProps {
  status: TaxStatus;
  showLabel?: boolean;
  size?: 'small' | 'medium';
}

// Componente estilizado para melhor visualização e consistência
const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  borderRadius: theme.shape.borderRadius
}));

// Mapeamento de cores por status
const getColorByStatus = (status: TaxStatus) => {
  switch (status) {
    case TaxStatus.PAID:
      return 'success';
    case TaxStatus.DUE:
      return 'warning';
    case TaxStatus.OVERDUE:
      return 'error';
    case TaxStatus.UPCOMING:
      return 'info';
    default:
      return 'default';
  }
};

// Mapeamento de rótulos por status
const getLabelByStatus = (status: TaxStatus) => {
  switch (status) {
    case TaxStatus.PAID:
      return 'Pago';
    case TaxStatus.DUE:
      return 'A pagar';
    case TaxStatus.OVERDUE:
      return 'Em atraso';
    case TaxStatus.UPCOMING:
      return 'Próximo';
    default:
      return 'Desconhecido';
  }
};

/**
 * Componente que exibe um badge com o status do imposto
 */
const TaxStatusBadge: React.FC<TaxStatusBadgeProps> = ({
  status,
  showLabel = true,
  size = 'small'
}) => {
  const color = getColorByStatus(status);
  const label = getLabelByStatus(status);
  
  // Se não deve mostrar rótulo, exibe apenas o indicador de cor
  if (!showLabel) {
    return (
      <Tooltip title={label}>
        <Box
          sx={{
            width: size === 'small' ? 8 : 12,
            height: size === 'small' ? 8 : 12,
            borderRadius: '50%',
            bgcolor: `${color}.main`,
            display: 'inline-block'
          }}
        />
      </Tooltip>
    );
  }
  
  // Exibe o chip com o rótulo
  return (
    <StyledChip
      label={label}
      color={color as any}
      size={size}
      variant="filled"
    />
  );
};

export default TaxStatusBadge; 