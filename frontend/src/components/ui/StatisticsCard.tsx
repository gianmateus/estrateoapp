import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme
} from '@mui/material';

interface StatisticsCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  height?: number | string;
}

/**
 * Componente de card personalizado para exibição de gráficos estatísticos
 * Inclui espaço para título, ícone e conteúdo personalizado
 */
const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  icon,
  children,
  height = 350
}) => {
  const theme = useTheme();

  return (
    <Card 
      sx={{
        height: height,
        borderRadius: '16px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.text.primary,
              fontSize: '1rem'
            }}
          >
            {title}
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: theme.palette.primary.main,
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: `${theme.palette.primary.main}10`
            }}
          >
            {icon}
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard; 