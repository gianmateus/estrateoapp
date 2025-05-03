/**
 * Componente PageTransition
 * 
 * Aplica animações suaves de transição entre páginas ou views,
 * melhorando a experiência de navegação no sistema.
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // Define a variante para a animação da página
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -10,
    },
  };

  // Define as transições
  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  // Verifica se o usuário prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Se o usuário preferir movimento reduzido, desabilita as animações
  const variants = prefersReducedMotion
    ? {
        initial: { opacity: 1 },
        in: { opacity: 1 },
        out: { opacity: 1 },
      }
    : pageVariants;

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : pageTransition;

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      style={{ 
        width: '100%', 
        height: '100%' 
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 