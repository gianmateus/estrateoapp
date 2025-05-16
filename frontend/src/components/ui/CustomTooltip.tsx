import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  title?: string;
  formatter?: (value: any) => [string | number, string];
}

/**
 * Tooltip personalizado para os gráficos Recharts
 * Apresenta um design mais moderno e consistente com o tema da aplicação
 */
const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label,
  title,
  formatter
}) => {
  const theme = useTheme();
  
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        p: 1.5,
        minWidth: 180,
        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      {title && (
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            mb: 1, 
            pb: 0.5, 
            borderBottom: `1px solid ${theme.palette.divider}` 
          }}
        >
          {title}
        </Typography>
      )}
      
      {label && (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          {label}
        </Typography>
      )}
      
      {payload.map((entry, index) => {
        const color = entry.color || theme.palette.primary.main;
        let value = entry.value;
        let name = entry.name;
        
        if (formatter && typeof value !== 'undefined') {
          const [formattedValue, formattedName] = formatter(value);
          value = formattedValue;
          name = formattedName || name;
        }
        
        return (
          <Box 
            key={`item-${index}`} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 0.5 
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                display: 'inline-block', 
                width: 12, 
                height: 12, 
                borderRadius: '2px', 
                bgcolor: color, 
                mr: 1 
              }} 
            />
            <Typography 
              variant="body2" 
              component="span" 
              sx={{ mr: 1, flexGrow: 1 }}
            >
              {name}:
            </Typography>
            <Typography 
              variant="body2" 
              component="span" 
              sx={{ fontWeight: 600 }}
            >
              {value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default CustomTooltip; 