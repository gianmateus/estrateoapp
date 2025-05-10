/**
 * Componente de Animação com Framer Motion
 * 
 * Encapsula elementos em um container com animações suaves,
 * mantendo um padrão consistente de movimentos em todo o app.
 */

import React, { forwardRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, BoxProps } from '@mui/material';

interface MotionContainerProps extends BoxProps {
  children: ReactNode;
  animate?: boolean;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom';
  duration?: number;
  delay?: number;
}

type TransitionOptions = {
  duration: number;
  delay?: number;
};

const getVariants = (animation: string, customDuration?: number, customDelay?: number) => {
  // Duração padrão entre 150ms e 200ms conforme especificação
  const defaultDuration = 0.18;
  
  // Configuração de transição com potencial delay
  const transition: TransitionOptions = {
    duration: customDuration || defaultDuration
  };
  
  // Adicionar delay se especificado
  if (customDelay) {
    transition.delay = customDelay;
  }

  switch (animation) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition
      };
    case 'slide-up':
      return {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 16 },
        transition
      };
    case 'slide-down':
      return {
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
        transition
      };
    case 'slide-left':
      return {
        initial: { opacity: 0, x: 16 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 16 },
        transition
      };
    case 'slide-right':
      return {
        initial: { opacity: 0, x: -16 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 },
        transition
      };
    case 'zoom':
      return {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition
      };
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition
      };
  }
};

const MotionContainer = forwardRef<HTMLDivElement, MotionContainerProps>(
  ({ children, animate = true, animation = 'fade', duration, delay, ...other }, ref) => {
    const variants = getVariants(animation, duration, delay);

    return (
      <AnimatePresence mode="wait">
        {animate && (
          <Box
            component={motion.div}
            ref={ref}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={variants.transition}
            {...other}
          >
            {children}
          </Box>
        )}
      </AnimatePresence>
    );
  }
);

export default MotionContainer; 