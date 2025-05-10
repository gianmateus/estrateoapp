import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { motion, HTMLMotionProps } from 'framer-motion';

// Em vez de usar motion(Button), vamos usar o Box como wrapper
interface ButtonWithAnimationProps extends ButtonProps {
  children: React.ReactNode;
}

const ButtonWithAnimation: React.FC<ButtonWithAnimationProps> = ({ 
  children, 
  ...props 
}) => {
  // Verifica se o usuário prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Define a animação do botão
  const buttonAnimation = prefersReducedMotion
    ? {}
    : {
        whileHover: { 
          scale: 1.05,
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
        },
        whileTap: { 
          scale: 0.98 
        },
        transition: { 
          type: 'spring', 
          stiffness: 400, 
          damping: 17 
        }
      };

  // Se o usuário preferir movimento reduzido, apenas renderiza o botão normal
  if (prefersReducedMotion) {
    return (
      <Button {...props}>
        {children}
      </Button>
    );
  }

  // Com movimento permitido, usa o motion.div como wrapper
  return (
    <motion.div
      {...buttonAnimation}
      style={{ display: 'inline-block' }}
    >
      <Button {...props}>
        {children}
      </Button>
    </motion.div>
  );
};

export default ButtonWithAnimation; 