import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Select, MenuItem, SelectChangeEvent } from '@mui/material';

// Flags para os idiomas suportados
const languageFlags: { [key: string]: string } = {
  en: '🇬🇧',
  pt: '🇧🇷',
  de: '🇩🇪',
  it: '🇮🇹'
};

// Nomes dos idiomas
const languageNames: { [key: string]: string } = {
  en: 'English',
  pt: 'Português',
  de: 'Deutsch',
  it: 'Italiano'
};

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        size="small"
        sx={{ 
          '& .MuiSelect-select': { 
            display: 'flex', 
            alignItems: 'center',
            py: 0.5
          }
        }}
      >
        {Object.keys(languageFlags).map((lang) => (
          <MenuItem 
            key={lang} 
            value={lang}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>
              {languageFlags[lang]}
            </span>
            {languageNames[lang]}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default LanguageSelector; 