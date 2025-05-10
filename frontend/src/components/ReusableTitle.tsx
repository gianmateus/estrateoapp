import React from 'react';
import { Typography, Box, TypographyProps, SxProps, Theme } from '@mui/material';

interface ReusableTitleProps {
  title: string;
  subtitle?: string;
  variant?: 'page' | 'section' | 'card' | 'subsection';
  align?: 'left' | 'center' | 'right';
  divider?: boolean;
  gutterBottom?: boolean;
  sx?: SxProps<Theme>;
  titleProps?: TypographyProps;
  subtitleProps?: TypographyProps;
}

/**
 * Componente de título reutilizável para padronizar tamanhos de títulos em toda a aplicação
 * Suporta diferentes níveis de hierarquia e alinhamentos
 */
const ReusableTitle: React.FC<ReusableTitleProps> = ({
  title,
  subtitle,
  variant = 'section',
  align = 'left',
  divider = false,
  gutterBottom = true,
  sx = {},
  titleProps = {},
  subtitleProps = {},
}) => {
  // Mapear variantes para tamanhos de texto adequados
  const getTitleVariant = (): TypographyProps['variant'] => {
    switch (variant) {
      case 'page':
        return 'h4'; // Antes era h2, agora h4
      case 'section':
        return 'h5'; // Antes era h3, agora h5
      case 'card':
        return 'h6'; // Antes era h4, agora h6
      case 'subsection':
        return 'subtitle1'; // Antes era h5, agora subtitle1
      default:
        return 'h5';
    }
  };

  const getSubtitleVariant = (): TypographyProps['variant'] => {
    switch (variant) {
      case 'page':
        return 'subtitle1';
      case 'section':
      case 'card':
        return 'body2';
      case 'subsection':
        return 'caption';
      default:
        return 'body2';
    }
  };

  // Definir estilos de fonte responsivos
  const getTitleFontSize = () => {
    switch (variant) {
      case 'page':
        return { xs: '1.8rem', sm: '2rem' };
      case 'section':
        return { xs: '1.5rem', sm: '1.7rem' };
      case 'card':
        return { xs: '1.25rem', sm: '1.4rem' };
      case 'subsection':
        return { xs: '1.1rem', sm: '1.2rem' };
      default:
        return { xs: '1.5rem', sm: '1.7rem' };
    }
  };

  return (
    <Box
      sx={{
        textAlign: align,
        mb: gutterBottom ? 3 : 0,
        ...sx,
      }}
    >
      <Typography
        variant={getTitleVariant()}
        fontWeight={variant === 'subsection' ? 500 : 600}
        color="text.primary"
        gutterBottom={!!subtitle}
        align={align}
        sx={{
          fontSize: getTitleFontSize(),
          lineHeight: 1.3,
          ...titleProps?.sx,
        }}
        {...titleProps}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant={getSubtitleVariant()}
          color="text.secondary"
          align={align}
          sx={{ ...subtitleProps?.sx }}
          {...subtitleProps}
        >
          {subtitle}
        </Typography>
      )}

      {divider && (
        <Box
          sx={{
            width: '100%',
            height: '1px',
            bgcolor: 'divider',
            mt: subtitle ? 2 : 1,
            mb: 3,
          }}
        />
      )}
    </Box>
  );
};

export default ReusableTitle; 