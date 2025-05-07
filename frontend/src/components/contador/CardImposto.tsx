import React from 'react';
import { Card, CardContent, Typography, Tooltip, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CardImpostoProps {
  tipo: string;
  valor: number | null | undefined;
  icone: React.ReactNode;
  cor?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error';
  legenda?: string;
}

const CardImposto: React.FC<CardImpostoProps> = ({ tipo, valor, icone, cor = 'primary', legenda }) => {
  const { t } = useTranslation();
  
  // Formatação aprimorada para valores monetários
  const valorFormatado = React.useMemo(() => {
    if (valor === null || valor === undefined) {
      return t('impostos.semDados', 'Sem dados');
    }
    
    // Garantir que sempre exibimos o valor formatado corretamente
    // mesmo que seja zero
    try {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(valor);
    } catch (e) {
      console.error('Erro ao formatar valor:', e);
      return valor.toString();
    }
  }, [valor, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: '100%' }}
    >
      <Tooltip title={legenda || tipo} arrow>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            borderColor: cor === 'neutral' ? 'grey.300' : `${cor}.main`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'box-shadow 0.3s, transform 0.3s',
            '&:hover': { 
              boxShadow: 6,
              transform: 'translateY(-4px)'
            },
            overflow: 'visible',
            p: 2,
          }}
        >
          <CardContent sx={{ p: 0, pb: '0!important', flex: 1 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: cor === 'neutral' ? 'grey.100' : `${cor}.light`,
                  borderRadius: '50%',
                  width: 48,
                  height: 48,
                  fontSize: 24,
                  color: cor === 'neutral' ? 'grey.700' : `${cor}.main`,
                }}
              >
                {icone}
              </Box>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                color="text.primary"
                sx={{ lineHeight: 1.2 }}
              >
                {tipo}
              </Typography>
            </Box>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              color={cor === 'neutral' ? 'text.primary' : `${cor}.main`}
              data-testid="valor-imposto"
              sx={{ 
                textAlign: 'right',
                mt: 2,
                letterSpacing: '-0.5px'
              }}
            >
              {valorFormatado}
            </Typography>
          </CardContent>
        </Card>
      </Tooltip>
    </motion.div>
  );
};

export default CardImposto; 