import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom MUI Button usando motion
const StyledMotionButton = styled(motion.div)({
  display: 'inline-block',
  position: 'relative',
});

// Props do componente
export interface MotionButtonProps extends ButtonProps {
  /**
   * Indica se a animação deve ser desativada
   * Automaticamente definido como true se prefers-reduced-motion estiver ativado
   */
  disableAnimation?: boolean;
}

/**
 * Botão com animação sutil ao passar o mouse
 * Respeita a preferência do usuário para movimento reduzido
 */
const MotionButton: React.FC<MotionButtonProps> = ({
  children,
  disableAnimation = false,
  ...buttonProps
}) => {
  // Detecta preferência de redução de movimento
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Não aplica animação se redução de movimento estiver ativada ou se explicitamente desativada
  const shouldAnimate = !disableAnimation && !prefersReducedMotion;

  return (
    <StyledMotionButton
      whileHover={shouldAnimate ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <Button {...buttonProps}>{children}</Button>
    </StyledMotionButton>
  );
};

export default MotionButton; 