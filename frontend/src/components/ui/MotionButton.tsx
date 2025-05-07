import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, HTMLMotionProps } from 'framer-motion';

// Estilização do botão com motion
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  transition: 'all 0.3s ease',
  fontWeight: 600,
  height: 48,
  '&.MuiButton-containedPrimary': {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '&.MuiButton-containedWarning': {
    background: theme.palette.warning.main,
    color: theme.palette.common.white,
  },
}));

// Componente de Motion do Framer Motion
const MotionComponent = motion(StyledButton);

// Props do componente
export interface MotionButtonProps extends ButtonProps {
  reduceMotion?: boolean;
}

// Componente MotionButton
export const MotionButton: React.FC<MotionButtonProps> = ({ 
  children, 
  reduceMotion = false, 
  ...props 
}) => {
  const hoverAnimation = reduceMotion ? {} : {
    scale: 1.05,
    transition: { duration: 0.2 }
  };

  const tapAnimation = reduceMotion ? {} : {
    scale: 0.98,
    transition: { duration: 0.1 }
  };
  
  // Verificar se o usuário prefere reduzir animações
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  
  // Desativar animações se o usuário preferir ou se a prop reduceMotion for true
  const shouldReduceMotion = reduceMotion || prefersReducedMotion;

  return (
    <MotionComponent
      component={motion.button}
      whileHover={shouldReduceMotion ? {} : hoverAnimation}
      whileTap={shouldReduceMotion ? {} : tapAnimation}
      {...props as any}
    >
      {children}
    </MotionComponent>
  );
};

export default MotionButton; 