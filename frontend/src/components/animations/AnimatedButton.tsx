/**
 * Componente AnimatedButton
 * 
 * Um botão com animações de escala suave ao passar o mouse (hover)
 * e ao clicar (tap/click), trazendo mais interatividade para a UI.
 */

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface AnimatedButtonProps extends ButtonProps {
  scaleOnHover?: number;
  scaleOnTap?: number;
}

// Usando styled components do MUI que é compatível com o framer-motion
const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => 
    prop !== 'scaleOnHover' && prop !== 'scaleOnTap'
})<AnimatedButtonProps>(({ scaleOnHover = 1.05, scaleOnTap = 0.95 }) => ({
  transition: 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
  '&:hover': {
    transform: `scale(${scaleOnHover})`,
  },
  '&:active': {
    transform: `scale(${scaleOnTap})`,
  }
}));

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  scaleOnHover,
  scaleOnTap,
  ...props 
}) => {
  return (
    <StyledButton
      scaleOnHover={scaleOnHover}
      scaleOnTap={scaleOnTap}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default AnimatedButton; 