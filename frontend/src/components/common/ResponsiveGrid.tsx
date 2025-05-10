import React from 'react';
import { Box, BoxProps, useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/material';

interface ResponsiveGridProps extends BoxProps {
  children: React.ReactNode;
  spacing?: number;
}

/**
 * Grid responsivo que se adapta aos breakpoints do tema:
 * - ≥1280 px → 3 colunas
 * - 768-1279 px → 2 colunas
 * - <768 px → 1 coluna
 */
const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  spacing = 3,
  ...boxProps
}) => {
  const theme = useTheme();
  
  // Detectar breakpoints usando os valores definidos no tema
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg')); // ≥1280px
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 768-1279px
  // Mobile é o padrão quando não é desktop nem tablet
  
  // Determinar o número de colunas
  const columns = isDesktop ? 3 : isTablet ? 2 : 1;
  
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr', // Mobile (padrão)
          md: 'repeat(2, 1fr)', // Tablet (≥768px)
          lg: 'repeat(3, 1fr)', // Desktop (≥1280px)
        },
        gap: spacing,
        width: '100%',
        ...boxProps.sx
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

export default ResponsiveGrid; 