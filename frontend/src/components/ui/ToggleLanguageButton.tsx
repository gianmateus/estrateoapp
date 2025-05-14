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

// Propriedades disponíveis para o componente
interface ToggleLanguageButtonProps {
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

// Flags para os idiomas suportados
const languageFlags: { [key: string]: string } = {
  en: '🇬🇧',
  pt: '🇧🇷',
  de: '🇩🇪',
  it: '🇮🇹'
};

// Nomes dos idiomas em seus idiomas nativos
const languageNames: { [key: string]: string } = {
  en: 'English',
  pt: 'Português',
  de: 'Deutsch',
  it: 'Italiano'
};

/**
 * Language toggle button with dropdown menu
 * Shows available languages and highlights the currently selected one
 * 
 * Botão de alternância de idioma com menu suspenso
 * Mostra os idiomas disponíveis e destaca o atualmente selecionado
 */
const ToggleLanguageButton = ({ tooltipPlacement = 'right' }: ToggleLanguageButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
    handleClose();
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
  ];

  return (
    <>
      <Tooltip title={t('mudarIdioma') || 'Change language'} placement={tooltipPlacement}>
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
            selected={i18n.language === lang.code}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>
              {languageFlags[lang.code]}
            </span>
            <ListItemText>{lang.name}</ListItemText>
            {i18n.language === lang.code && (
              <CheckIcon fontSize="small" color="primary" />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ToggleLanguageButton; 