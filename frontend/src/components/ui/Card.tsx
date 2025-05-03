/**
 * Componente Card
 * 
 * Um componente de card reutilizável que aplica o estilo visual padronizado
 * do sistema Estrateo com bordas arredondadas e sombras suaves.
 * 
 * Este componente encapsula o Card do Material UI e aplica os estilos definidos
 * nas diretrizes de design do sistema.
 */

import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';

export interface CardProps extends MuiCardProps {
  children: React.ReactNode;
  elevation?: number;
  clickable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  elevation, 
  clickable = false,
  sx,
  ...props 
}) => {
  return (
    <MuiCard
      sx={{
        borderRadius: '16px',
        transition: 'transform 0.2s ease',
        ...(clickable && {
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
          }
        }),
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
};

export default Card; 