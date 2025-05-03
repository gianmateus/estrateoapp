/**
 * Componente PageTransition
 * 
 * Aplica animações suaves de transição entre páginas ou views,
 * melhorando a experiência de navegação no sistema.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Box, BoxProps } from '@mui/material';

export interface PageTransitionProps extends BoxProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom';
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  'slide-up': {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  'slide-down': {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  'slide-left': {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  'slide-right': {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  zoom: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  }
};

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  animation = 'fade',
  ...props
}) => {
  const selectedVariant = variants[animation];

  return (
    <Box
      component={motion.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariant}
      transition={{ 
        type: 'tween', 
        ease: 'easeInOut', 
        duration: 0.4 
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default PageTransition; 