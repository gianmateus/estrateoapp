/**
 * Componente InfoCard
 * 
 * Um componente de card de informações reutilizável para exibir dados resumidos
 * no dashboard e em outras áreas do sistema.
 * 
 * Props:
 * - title: Título/label do card
 * - value: Valor a ser exibido (número ou texto)
 * - icon: Ícone opcional a ser exibido
 * - variation: Variação de cor (default, success, warning, danger)
 * - subtitle: Texto secundário opcional
 * - loading: Estado de carregamento
 * - onClick: Função opcional para tornar o card clicável
 * - size: Tamanho do card (small, medium, large)
 * - index: Índice para animações sequenciais
 */

import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { AnimatedCard } from '../animations';

export type InfoCardVariation = 'default' | 'success' | 'warning' | 'danger';
export type InfoCardSize = 'small' | 'medium' | 'large';

export interface InfoCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  variation?: InfoCardVariation;
  subtitle?: string;
  loading?: boolean;
  onClick?: () => void;
  size?: InfoCardSize;
  index?: number; // Para stagger animations
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  icon,
  variation = 'default',
  subtitle,
  loading = false,
  onClick,
  size = 'medium',
  index = 0
}) => {
  const theme = useTheme();
  
  // Mapeamento de variações para cores
  const getColor = () => {
    switch (variation) {
      case 'success': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'danger': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };
  
  // Mapeamento de tamanhos para dimensões dos elementos
  const getTitleSize = () => {
    switch (size) {
      case 'small': return 'caption';
      case 'large': return 'h6';
      default: return 'caption';
    }
  };
  
  const getValueSize = () => {
    switch (size) {
      case 'small': return 'h4';
      case 'large': return 'h2';
      default: return 'h3';
    }
  };
  
  const getSubtitleSize = () => {
    switch (size) {
      case 'small': return 'caption';
      case 'large': return 'body2';
      default: return 'caption';
    }
  };

  return (
    <AnimatedCard
      index={index}
      clickable={!!onClick}
      onClick={onClick}
      sx={{
        padding: size === 'small' ? theme.spacing(3) : theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: size === 'small' ? 2 : 3 }}>
        <Typography variant={getTitleSize()} color="text.secondary">
          {title}
        </Typography>
        {icon && (
          <Box sx={{ color: getColor() }}>
            {icon}
          </Box>
        )}
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} color="inherit" />
        </Box>
      ) : (
        <>
          <Typography variant={getValueSize()} sx={{ color: getColor(), fontWeight: 600 }}>
            {value}
          </Typography>
          
          {subtitle && (
            <Typography 
              variant={getSubtitleSize()} 
              color="text.secondary" 
              sx={{ mt: size === 'small' ? 1 : 2 }}
            >
              {subtitle}
            </Typography>
          )}
        </>
      )}
    </AnimatedCard>
  );
};

export default InfoCard; 