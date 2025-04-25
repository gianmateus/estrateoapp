import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../../contexts/ThemeContext';

interface ToggleDarkModeButtonProps {
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

const ToggleDarkModeButton: React.FC<ToggleDarkModeButtonProps> = ({ 
  tooltipPlacement = 'bottom'
}) => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Tooltip 
      title={mode === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      placement={tooltipPlacement}
    >
      <IconButton 
        onClick={toggleTheme} 
        color="inherit"
        aria-label={mode === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
        sx={{ 
          ml: 1,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'rotate(30deg)',
          }
        }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ToggleDarkModeButton; 