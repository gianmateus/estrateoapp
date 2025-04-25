/**
 * Toggle language button component
 * Allows users to switch between available application languages
 * 
 * Componente de botão para alternar idiomas
 * Permite que os usuários alternem entre os idiomas disponíveis da aplicação
 */
import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import { 
  Translate as TranslateIcon,
  Check as CheckIcon 
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useIdioma } from '../../contexts/IdiomaContext';

// Ícones de bandeiras para cada idioma
import UkIcon from '@mui/icons-material/Flag'; // Substituir por ícones reais de bandeiras se disponíveis
import BrIcon from '@mui/icons-material/Flag';
import DeIcon from '@mui/icons-material/Flag';
import ItIcon from '@mui/icons-material/Flag';

// Propriedades disponíveis para o componente
interface ToggleLanguageButtonProps {
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Language toggle button with dropdown menu
 * Shows available languages and highlights the currently selected one
 * 
 * Botão de alternância de idioma com menu suspenso
 * Mostra os idiomas disponíveis e destaca o atualmente selecionado
 */
const ToggleLanguageButton = ({ tooltipPlacement = 'right' }: ToggleLanguageButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentLanguage, changeLanguage } = useIdioma();
  const { t } = useTranslation();
  const theme = useTheme();
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (language: string) => {
    changeLanguage(language);
    handleClose();
  };

  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
  ];

  return (
    <>
      <Tooltip title={t('mudarIdioma')} placement={tooltipPlacement}>
        <IconButton 
          onClick={handleClick}
          aria-controls="language-menu"
          aria-haspopup="true"
          color="inherit"
          size="small"
          sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            }
          }}
        >
          <TranslateIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            onClick={() => handleLanguageSelect(lang.code)}
            selected={currentLanguage === lang.code}
          >
            <ListItemIcon sx={{ minWidth: '30px' }}>
              {currentLanguage === lang.code && (
                <CheckIcon fontSize="small" color="primary" />
              )}
            </ListItemIcon>
            <ListItemText>{lang.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ToggleLanguageButton; 