import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { formatCurrency } from '../utils/formatters';

interface CurrencyProps extends Omit<TypographyProps, 'children'> {
  value: number;
  showZero?: boolean;
  defaultText?: string;
}

/**
 * Componente para exibir valores monetários formatados em toda a aplicação
 * 
 * @example
 * <Currency value={12345.67} />                  // € 12.345,67
 * <Currency value={0} showZero={true} />         // € 0,00
 * <Currency value={0} defaultText="Sem valor" /> // Sem valor
 */
const Currency: React.FC<CurrencyProps> = ({
  value,
  showZero = true,
  defaultText = '',
  ...typographyProps
}) => {
  // Não mostrar zero se showZero for false e o valor for 0
  if (!showZero && value === 0) {
    return <Typography {...typographyProps}>{defaultText}</Typography>;
  }

  return (
    <Typography {...typographyProps}>
      {formatCurrency(value)}
    </Typography>
  );
};

export default Currency; 