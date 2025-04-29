import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Paleta de cores para o tema claro
const lightPalette = {
  primary: {
    main: '#1a365d', // Azul escuro para ações principais (mais profissional)
    dark: '#102a4c', // Versão mais escura para hover
    light: '#4a6fa5', // Versão mais clara
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F5F5F7', // Cor Apple-like cinza claro
    dark: '#E5E5E7',
    light: '#FAFAFA',
    contrastText: '#1D1D1F',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  info: {
    main: '#0288D1',
    light: '#03A9F4',
    dark: '#01579B',
  },
  success: {
    main: '#4caf50',
    light: '#81C784',
    dark: '#388E3C',
  },
  background: {
    default: '#FFFFFF', // Fundo branco puro
    paper: '#F5F5F7',   // Cartões em cinza muito claro (Apple-like)
  },
  text: {
    primary: '#1D1D1F',   // Texto quase preto (Apple-like)
    secondary: '#86868B', // Texto cinza (Apple-like)
    disabled: '#AEAEB2',
  },
  grey: {
    50: '#f7f7f7',
    100: '#e6e6e6',
    200: '#d1d1d1',
    300: '#ababab',
    400: '#808080',
    500: '#595959',
    600: '#383838',
    700: '#1f1f1f',
    800: '#141414',
    900: '#0a0a0a',
  }
};

// Paleta de cores para o tema escuro
const darkPalette = {
  primary: {
    main: '#1a365d',     // Mantém a mesma cor principal
    dark: '#102a4c',
    light: '#4a6fa5',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#2C2C2E',     // Cinza escuro (Apple-like)
    dark: '#1C1C1E',
    light: '#3A3A3C',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  info: {
    main: '#29B6F6',
    light: '#4FC3F7',
    dark: '#0288D1',
  },
  success: {
    main: '#66BB6A',
    light: '#81C784',
    dark: '#388E3C',
  },
  background: {
    default: '#0D1117', // Fundo quase preto, confortável
    paper: '#161B22',   // Cinza/preto azulado
  },
  text: {
    primary: '#E5E7EB',   // Cinza claro quase branco
    secondary: '#9CA3AF', // Cinza médio
    disabled: '#68686E',
  },
  grey: {
    50: '#f7f7f7',
    100: '#e6e6e6',
    200: '#d1d1d1',
    300: '#ababab',
    400: '#808080',
    500: '#595959',
    600: '#383838',
    700: '#1f1f1f',
    800: '#141414',
    900: '#0a0a0a',
  }
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

// Propriedades do provedor de tema
interface ThemeProviderProps {
  children: ReactNode;
}

// Provedor de tema
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
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

  // Criação do tema com base no modo selecionado (claro/escuro)
  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
    typography: {
      fontFamily: '"Inter", "SF Pro Text", "Helvetica", "Arial", sans-serif',
      // Implementação da hierarquia tipográfica padronizada
      h1: {
        fontWeight: 700,         // Bold
        fontSize: '32px',        // 32px Bold
        letterSpacing: '-0.015em',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,         // Semibold
        fontSize: '24px',        // 24px Semibold
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 500,         // Medium
        fontSize: '18px',        // 18px Medium
        letterSpacing: '-0.005em',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 500,
        fontSize: '16px',
        letterSpacing: '-0.005em',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 500,
        fontSize: '15px',
        letterSpacing: '-0.005em',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 500,
        fontSize: '14px',
        letterSpacing: '-0.005em',
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '14px',        // 14px Regular
        fontWeight: 400,
        letterSpacing: '-0.003em',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '14px',
        fontWeight: 400,
        letterSpacing: '-0.003em',
        lineHeight: 1.5,
      },
      caption: {
        fontSize: '12px',        // 12px Medium
        fontWeight: 500,
        letterSpacing: '-0.003em',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '-0.003em',
        fontSize: '14px',
      },
    },
    shape: {
      borderRadius: 12,
    },
    // Sistema de espaçamento baseado na escala proposta (4, 8, 16, 32, 64)
    spacing: (factor: number) => {
      const baseSpacing = 4;
      if (factor <= 0) return '0px';
      if (factor === 1) return `${baseSpacing}px`;     // 4px
      if (factor === 2) return `${baseSpacing * 2}px`; // 8px
      if (factor === 4) return `${baseSpacing * 4}px`; // 16px
      if (factor === 8) return `${baseSpacing * 8}px`; // 32px
      if (factor === 16) return `${baseSpacing * 16}px`; // 64px
      return `${baseSpacing * factor}px`;
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            padding: '10px 20px',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            },
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: mode === 'light' ? '#102a4c' : '#4a6fa5',
            },
          },
          containedSecondary: {
            backgroundColor: mode === 'light' ? '#F5F5F7' : '#2C2C2E',
            color: mode === 'light' ? '#1D1D1F' : '#FFFFFF',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#E5E5E7' : '#3A3A3C',
            },
          },
          outlined: {
            borderWidth: '1px',
            '&:hover': {
              borderWidth: '1px',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'all 0.2s ease',
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(26, 54, 93, 0.1)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1a365d',
              borderWidth: '1px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#1D1D1F' : '#FFFFFF',
            },
          },
          input: {
            padding: '12px 16px',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            '&.Mui-focused': {
              color: '#1a365d',
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: mode === 'light' ? '#86868B' : '#98989D',
            '&.Mui-checked': {
              color: '#1a365d',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12, // Card com arredondamento padronizado
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.06)', // Sombra padronizada conforme especificado
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '16px',
            borderBottom: `1px solid ${mode === 'light' ? '#F2F2F2' : '#374151'}`,
          },
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'light' 
              ? '#F5F5F7'
              : '#2C2C2E',
            color: mode === 'light' ? '#1D1D1F' : '#FFFFFF',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'light' 
                ? 'rgba(245, 245, 247, 0.5)'
                : 'rgba(44, 44, 46, 0.5)',
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#0D1117',
            borderRight: 'none',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: mode === 'light' ? '#F2F2F2' : '#374151',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: mode === 'light' 
                ? 'rgba(26, 54, 93, 0.08)' 
                : 'rgba(26, 54, 93, 0.15)',
            },
            '&:hover': {
              backgroundColor: mode === 'light' 
                ? 'rgba(0, 0, 0, 0.04)' 
                : 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'all 0.2s ease',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          },
        },
      },
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