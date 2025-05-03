import React from 'react';
import { Card, CardContent, CardHeader, CardActions, Typography, Box, useTheme, Paper } from '@mui/material';
import type { CardProps } from '@mui/material';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';

interface PremiumCardProps {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  elevation?: number;
  hoverEffect?: boolean;
  cardVariant?: 'default' | 'outlined' | 'contained';
}

const PremiumCard: React.FC<PremiumCardProps & Omit<CardProps, 'variant'>> = ({
  title,
  subheader,
  children,
  footer,
  elevation = 0,
  hoverEffect = true,
  cardVariant = 'default',
  ...props
}) => {
  const theme = useTheme();
  
  // Verifica se o usuário prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Estilos baseados no variant
  const getCardStyles = () => {
    switch (cardVariant) {
      case 'outlined':
        return {
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          backgroundColor: theme.palette.background.paper,
        };
      case 'contained':
        return {
          boxShadow: theme.shadows[elevation],
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          border: 'none',
        };
      default:
        return {
          boxShadow: theme.shadows[elevation],
          backgroundColor: theme.palette.background.paper,
          border: 'none',
        };
    }
  };

  // Definimos a variante do MUI Card com base em nosso cardVariant
  let muiVariant: 'elevation' | 'outlined' = 'elevation';
  if (cardVariant === 'outlined') {
    muiVariant = 'outlined';
  }

  // Se preferir movimento reduzido ou hoverEffect for false, usamos o Card normal
  if (prefersReducedMotion || !hoverEffect) {
    return (
      <Card
        variant={muiVariant}
        elevation={elevation}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          padding: theme.spacing(0),
          transition: 'all 0.3s ease',
          ...getCardStyles(),
        }}
        {...props}
      >
        {title && (
          <CardHeader
            title={
              typeof title === 'string' ? (
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
              ) : (
                title
              )
            }
            subheader={subheader}
            sx={{
              padding: theme.spacing(3, 3, 1, 3),
            }}
          />
        )}
        <CardContent sx={{ padding: theme.spacing(3) }}>
          <Box>
            {children}
          </Box>
        </CardContent>
        {footer && (
          <CardActions sx={{ padding: theme.spacing(2, 3, 3, 3) }}>
            {footer}
          </CardActions>
        )}
      </Card>
    );
  }

  // Para casos com animação, usamos o componente motion
  return (
    <Box
      component={motion.div}
      whileHover={{ 
        y: -5,
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        transition: { duration: 0.3 } 
      }}
    >
      <Card
        variant={muiVariant}
        elevation={elevation}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          padding: theme.spacing(0),
          transition: 'all 0.3s ease',
          ...getCardStyles(),
        }}
        {...props}
      >
        {title && (
          <CardHeader
            title={
              typeof title === 'string' ? (
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
              ) : (
                title
              )
            }
            subheader={subheader}
            sx={{
              padding: theme.spacing(3, 3, 1, 3),
            }}
          />
        )}
        <CardContent sx={{ padding: theme.spacing(3) }}>
          <Box>
            {children}
          </Box>
        </CardContent>
        {footer && (
          <CardActions sx={{ padding: theme.spacing(2, 3, 3, 3) }}>
            {footer}
          </CardActions>
        )}
      </Card>
    </Box>
  );
};

export default PremiumCard; 