/**
 * Summary card component used in the Contador (Accountant) module
 * Displays a financial metric with an icon and formatted value
 * 
 * Componente de card de resumo usado no módulo Contador
 * Exibe uma métrica financeira com ícone e valor formatado
 */
import React from 'react';
import { CardContent, Typography, Box, SvgIconProps, useTheme } from '@mui/material';
import { AnimatedCard } from '../animations';

interface ResumoMensalCardProps {
  title: string;           // Card title / Título do card
  value: number;           // Value to display / Valor a ser exibido
  icon: React.ReactElement<SvgIconProps>; // Icon component / Componente de ícone
  color: string;           // Accent color / Cor de destaque
  isCount?: boolean;       // Whether the value is a count (not currency) / Se o valor é uma contagem (não moeda)
  index?: number;          // Index for stagger animations / Índice para animações sequenciais
}

/**
 * Card component displaying a financial summary metric with icon and formatted value
 * 
 * Componente de card que exibe uma métrica de resumo financeiro com ícone e valor formatado
 */
const ResumoMensalCard: React.FC<ResumoMensalCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  isCount = false,
  index = 0
}) => {
  const theme = useTheme();
  
  /**
   * Formats currency value in Euro format
   * @param value Number to format
   * @returns Formatted string
   * 
   * Formata valor monetário no formato Euro
   * @param value Número a formatar
   * @returns String formatada
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };
  
  return (
    <AnimatedCard index={index}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography 
              variant="h6" 
              component="div" 
              fontWeight="bold" 
              sx={{ 
                mt: 1,
                fontSize: { xs: '1.3rem', sm: '1.5rem' }, 
                lineHeight: 1.2
              }}
            >
              {isCount ? value : formatCurrency(value)}
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              bgcolor: `${color}22`, // Color with transparency
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              p: 1,
              color: color
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </AnimatedCard>
  );
};

export default ResumoMensalCard; 