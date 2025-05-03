/**
 * Componente AnimatedList
 * 
 * Uma lista que anima seus itens em sequência (stagger animation),
 * criando um efeito elegante de carregamento progressivo.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, BoxProps } from '@mui/material';
import { usePrefersReducedMotion } from '../../hooks';

export interface AnimatedListProps extends BoxProps {
  children: React.ReactNode[];
  staggerDuration?: number;
  itemDelay?: number;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom';
  animate?: boolean; // Permite desativar animações explicitamente
}

const getItemVariants = (animation: string) => {
  switch (animation) {
    case 'fade':
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
      };
    case 'slide-up':
      return {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 }
      };
    case 'slide-down':
      return {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
      };
    case 'slide-left':
      return {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 10 }
      };
    case 'slide-right':
      return {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -10 }
      };
    case 'zoom':
      return {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
      };
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
      };
  }
};

const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  staggerDuration = 0.1,
  itemDelay = 0.2,
  animation = 'slide-up',
  animate = true,
  ...props
}) => {
  const itemVariants = getItemVariants(animation);
  
  // Verificar se o usuário prefere reduzir o movimento
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Determinar se deve animar com base nas props e nas preferências de usuário
  const shouldAnimate = animate && !prefersReducedMotion;
  
  // Se não deve animar, renderizar apenas o conteúdo normal
  if (!shouldAnimate) {
    return (
      <Box {...props}>
        {children}
      </Box>
    );
  }
  
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: staggerDuration,
        delayChildren: itemDelay
      }
    }
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      <AnimatePresence mode="wait">
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            transition={{ 
              type: 'spring',
              damping: 20,
              stiffness: 300
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default AnimatedList; 