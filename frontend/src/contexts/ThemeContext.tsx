import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import premiumTheme from '../theme/theme';
import { PaletteOptions } from '@mui/material';

// Cores oficiais do sistema
const COLORS = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  BLUE_DARK: '#0A2540',
  GRAY_LIGHT: '#F5F5F5',
  GRAY_MEDIUM: '#86868B',
  GRAY_DARK: '#1D1D1F',
  GRAY_DARKEST: '#121212'
};

// Tema escuro premium (baseado no tema premium mas com cores adaptadas para dark mode)
const darkPremiumPalette = {
  primary: {
    main: COLORS.BLUE_DARK,
    light: '#33506a',
    dark: '#07192e',
    contrastText: COLORS.WHITE,
  },
  secondary: {
    main: COLORS.WHITE,
    light: '#FAFAFA',
    dark: '#E0E0E0',
    contrastText: COLORS.BLACK,
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: COLORS.WHITE,
    secondary: '#AAAAAA',
    disabled: '#666666',
  },
  grey: {
    100: '#333333',
    200: '#444444',
    300: '#555555',
    400: '#666666',
    500: '#777777',
    600: '#888888',
    700: '#999999',
    800: '#AAAAAA',
    900: '#BBBBBB',
  },
  success: {
    main: '#00B37E',
    light: '#3DD598',
    dark: '#009D69',
    contrastText: COLORS.WHITE,
  },
  error: {
    main: '#F75A68',
    light: '#FF7A85',
    dark: '#E03A48',
    contrastText: COLORS.WHITE,
  },
  info: {
    main: '#3182CE',
    light: '#4299E1',
    dark: '#2B6CB0',
    contrastText: COLORS.WHITE,
  },
  warning: {
    main: '#F6AD55',
    light: '#FBD38D',
    dark: '#ED8936',
    contrastText: COLORS.BLACK,
  },
  divider: 'rgba(255, 255, 255, 0.1)',
};

// Interface para o valor do contexto do tema
interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

// Criação do contexto
export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

// Hook para consumir o contexto do tema
export const useTheme = () => useContext(ThemeContext);

// Hook para alternar o tema (corrigido para retornar o objeto completo)
export const useThemeToggle = () => {
  return useContext(ThemeContext);
};

// Propriedades do provedor de tema
interface ThemeProviderProps {
  children: ReactNode;
  theme?: any; // Adicionado para resolver o erro de tipo
}

// Provedor de tema
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme: propTheme }) => {
  // Estado para controlar o tema (claro/escuro)
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Efeito para carregar preferência de tema do localStorage na inicialização
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setMode(savedTheme as 'light' | 'dark');
    } else {
      // Detectar preferência do sistema
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, []);

  // Função para alternar entre os temas claro e escuro
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
    
    // Adicionar ou remover a classe 'dark' do elemento html
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Efeito para sincronizar a classe 'dark' no elemento html
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  // Criar tema com base no tema premium, mas alternar para dark mode quando necessário
  const theme = propTheme || createTheme({
    ...premiumTheme,
    palette: {
      mode,
      ...(mode === 'light' 
        ? premiumTheme.palette 
        : darkPremiumPalette as PaletteOptions),
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 