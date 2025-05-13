import React from 'react';
import { Card, CardContent, Typography, Tooltip, Box, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

interface CardImpostoProps {
  tipo: string;
  valor: number | null | undefined;
  icone: React.ReactNode;
  cor?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error';
  legenda?: string;
}

const CardImposto: React.FC<CardImpostoProps> = ({ tipo, valor, icone, cor = 'primary', legenda }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Garantir que o tipo e legenda nunca sejam null
  const tipoSeguro = tipo || 'Imposto';
  const legendaSegura = legenda || '';
  
  // Formatação aprimorada para valores monetários
  const valorFormatado = React.useMemo(() => {
    if (valor === null || valor === undefined) {
      return '€ 0,00';
    }
    
    try {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(valor);
    } catch (e) {
      console.error('Erro ao formatar valor:', e);
      return '€ 0,00';
    }
  }, [valor]);

  // Configurações de animação respeitando preferências de acessibilidade
  const motionProps = prefersReducedMotion 
    ? {} 
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      };

  return (
    <motion.div
      {...motionProps}
      style={{ height: '100%' }}
    >
      <Tooltip title={legendaSegura || tipoSeguro} arrow placement="top">
        <Card
          elevation={1}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: theme.shape.borderRadius,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { 
              boxShadow: theme.shadows[3],
              transform: prefersReducedMotion ? 'none' : 'translateY(-3px)'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: cor === 'neutral' ? theme.palette.grey[400] : theme.palette[cor].main,
              zIndex: 1
            }
          }}
        >
          <CardContent sx={{ p: 2, pb: '16px !important', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: cor === 'neutral' ? 'grey.100' : `${cor}.lighter`,
                  borderRadius: '50%',
                  width: 42,
                  height: 42,
                  color: cor === 'neutral' ? 'grey.700' : `${cor}.main`,
                }}
              >
                {React.cloneElement(icone as React.ReactElement, { 
                  sx: { fontSize: 22 }
                })}
              </Box>
              <Typography 
                variant="subtitle1" 
                fontWeight={600} 
                color="text.primary"
                sx={{ lineHeight: 1.2 }}
              >
                {tipoSeguro}
              </Typography>
            </Box>
            
            <Box flexGrow={1} display="flex" alignItems="flex-end" justifyContent="flex-end">
              <Typography 
                variant="h4" 
                fontWeight={700} 
                color={cor === 'neutral' ? 'text.primary' : `${cor}.main`}
                data-testid="valor-imposto"
                sx={{ 
                  letterSpacing: '-0.5px'
                }}
              >
                {valorFormatado}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Tooltip>
    </motion.div>
  );
};

export default CardImposto; 