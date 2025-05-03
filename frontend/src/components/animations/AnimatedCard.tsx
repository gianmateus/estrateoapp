/**
 * Componente AnimatedCard
 * 
 * Um card que possui animação de fade-in ao aparecer na tela
 * e transições suaves ao interagir.
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import Card from '../ui/Card';
import { CardProps } from '../ui/Card';
import { usePrefersReducedMotion } from '../../hooks';

export interface AnimatedCardProps extends CardProps {
  index?: number; // Para stagger animations
  animate?: boolean; // Permite desativar animações explicitamente
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, index = 0, clickable, animate = true, ...props }, ref) => {
    // Criar uma referência para detectar quando o elemento está visível
    const inViewRef = React.useRef(null);
    const isInView = useInView(inViewRef, { once: true, amount: 0.3 });
    
    // Verificar se o usuário prefere reduzir o movimento
    const prefersReducedMotion = usePrefersReducedMotion();
    
    // Determinar se deve animar com base nas props e nas preferências de usuário
    const shouldAnimate = animate && !prefersReducedMotion;
    
    // Se não deve animar, renderizar apenas o Card normal
    if (!shouldAnimate) {
      return (
        <Card ref={ref} clickable={clickable} {...props}>
          {children}
        </Card>
      );
    }
    
    return (
      <motion.div
        ref={inViewRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ 
          duration: 0.4,
          delay: index * 0.1, // Delay baseado no índice para stagger animation
          ease: [0.25, 0.1, 0.25, 1] // Curva de easing suave
        }}
        whileHover={clickable ? { scale: 1.02 } : undefined}
        whileTap={clickable ? { scale: 0.98 } : undefined}
      >
        <Card
          ref={ref}
          clickable={clickable}
          {...props}
        >
          {children}
        </Card>
      </motion.div>
    );
  }
);

export default AnimatedCard; 