/**
 * Componente AnimatedModal
 * 
 * Um modal com animações suaves de entrada e saída,
 * combinando fade e slide para uma experiência premium.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Modal, Box, ModalProps, BoxProps } from '@mui/material';
import { usePrefersReducedMotion } from '../../hooks';

export interface AnimatedModalProps extends Omit<ModalProps, 'children'> {
  children: React.ReactNode;
  contentProps?: BoxProps;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'zoom';
  animate?: boolean; // Permite desativar animações explicitamente
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  children,
  open,
  onClose,
  contentProps,
  animation = 'slide-up',
  animate: shouldAnimateProp = true,
  ...props
}) => {
  // Verificar se o usuário prefere reduzir o movimento
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Determinar se deve animar com base nas props e nas preferências de usuário
  const shouldAnimate = shouldAnimateProp && !prefersReducedMotion;

  // Propriedades de animação com base no tipo escolhido
  const getAnimationProps = () => {
    if (!shouldAnimate) return {};
    
    switch (animation) {
      case 'slide-up':
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 },
          transition: { type: 'spring', damping: 25, stiffness: 300 }
        };
      case 'slide-down':
        return {
          initial: { opacity: 0, y: -50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { type: 'spring', damping: 25, stiffness: 300 }
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          transition: { type: 'spring', damping: 25, stiffness: 300 }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.2 }
        };
    }
  };

  // Componente interno do modal
  const MotionComponent = shouldAnimate ? motion.div : 'div';

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      closeAfterTransition
      {...props}
    >
      <Box
        component={MotionComponent}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 'auto' },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto',
          outline: 'none',
          ...(contentProps?.sx || {})
        }}
        {...getAnimationProps()}
        {...(contentProps || {})}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default AnimatedModal; 