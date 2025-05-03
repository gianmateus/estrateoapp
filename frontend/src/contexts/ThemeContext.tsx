import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Cores oficiais do sistema
const COLORS = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  BLUE_DARK: '#0A2540',
  GRAY_LIGHT: '#F5F5F7',
  GRAY_MEDIUM: '#86868B',
  GRAY_DARK: '#1D1D1F',
  GRAY_DARKEST: '#121212'
};

// Paleta de cores para o tema claro
const lightPalette = {
  primary: {
    main: COLORS.BLUE_DARK, // Azul escuro oficial
    dark: '#07192e', // Versão mais escura para hover
    light: '#33506a', // Versão mais clara
    contrastText: COLORS.WHITE,
  },
  secondary: {
    main: COLORS.BLACK, // Preto oficial
    dark: COLORS.BLACK,
    light: COLORS.GRAY_DARK,
    contrastText: COLORS.WHITE,
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
    main: COLORS.BLUE_DARK,
    light: '#33506a',
    dark: '#07192e',
  },
  success: {
    main: '#4caf50',
    light: '#81C784',
    dark: '#388E3C',
  },
  background: {
    default: COLORS.WHITE, // Fundo branco puro
    paper: COLORS.GRAY_LIGHT, // Cartões em cinza muito claro
  },
  text: {
    primary: COLORS.BLACK, // Texto preto oficial
    secondary: COLORS.GRAY_MEDIUM, // Texto cinza para detalhes e rótulos
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
    main: COLORS.BLUE_DARK, // Mantém o azul escuro oficial
    dark: '#07192e',
    light: '#33506a',
    contrastText: COLORS.WHITE,
  },
  secondary: {
    main: COLORS.WHITE, // Branco como secundário no modo escuro
    dark: '#e6e6e6',
    light: COLORS.WHITE,
    contrastText: COLORS.BLACK,
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
    default: COLORS.BLACK, // Fundo preto puro no modo escuro
    paper: COLORS.GRAY_DARKEST, // Preto suave para cards e painéis
  },
  text: {
    primary: COLORS.WHITE, // Texto branco puro
    secondary: '#9CA3AF', // Cinza médio para textos secundários
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
      // Configuração da família de fonte principal e fallbacks
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      // Implementação da hierarquia tipográfica padronizada
      h1: {
        fontWeight: 700,         // Bold
        fontSize: '2.5rem',       // 40px
        letterSpacing: '-0.015em',
        lineHeight: 1.2,
        marginBottom: '0.5em',
      },
      h2: {
        fontWeight: 600,         // Semibold
        fontSize: '2rem',         // 32px
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
        marginBottom: '0.5em',
      },
      h3: {
        fontWeight: 600,         // Semibold
        fontSize: '1.5rem',       // 24px
        letterSpacing: '-0.005em',
        lineHeight: 1.4,
        marginBottom: '0.5em',
      },
      h4: {
        fontWeight: 500,         // Medium
        fontSize: '1.25rem',      // 20px
        letterSpacing: '0em',
        lineHeight: 1.4,
        marginBottom: '0.5em',
      },
      h5: {
        fontWeight: 500,         // Medium
        fontSize: '1.125rem',     // 18px
        letterSpacing: '0em',
        lineHeight: 1.5,
        marginBottom: '0.5em',
      },
      h6: {
        fontWeight: 500,         // Medium
        fontSize: '1rem',         // 16px
        letterSpacing: '0em',
        lineHeight: 1.5,
        marginBottom: '0.5em',
      },
      body1: {
        fontSize: '1rem',         // 16px
        fontWeight: 400,          // Regular
        letterSpacing: '0em',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',     // 14px
        fontWeight: 400,          // Regular
        letterSpacing: '0em',
        lineHeight: 1.5,
      },
      subtitle1: {
        fontSize: '1rem',         // 16px
        fontWeight: 500,          // Medium
        letterSpacing: '0em',
        lineHeight: 1.5,
      },
      subtitle2: {
        fontSize: '0.875rem',     // 14px
        fontWeight: 500,          // Medium
        letterSpacing: '0em',
        lineHeight: 1.5,
      },
      caption: {
        fontSize: '0.75rem',      // 12px
        fontWeight: 400,          // Regular
        letterSpacing: '0.03em',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',    // Não forçar maiúsculas
        fontWeight: 600,          // Semibold
        letterSpacing: '0em',
        fontSize: '0.875rem',     // 14px
      },
      overline: {
        fontSize: '0.75rem',      // 12px
        fontWeight: 600,          // Semibold
        letterSpacing: '0.08em',  // Tracking mais espaçado
        textTransform: 'uppercase',
        lineHeight: 1.5,
      }
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            boxSizing: 'border-box',
          },
          '*, *::before, *::after': {
            boxSizing: 'inherit',
          },
          body: {
            margin: 0,
            padding: 0,
            background: mode === 'light' ? lightPalette.background.default : darkPalette.background.default,
            color: mode === 'light' ? lightPalette.text.primary : darkPalette.text.primary,
            lineHeight: '1.5',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          // Remover margens padrão dos elementos tipográficos para maior controle
          'h1, h2, h3, h4, h5, h6, p': {
            marginTop: 0,
          },
        },
      },
      // Personalização adicional de componentes com tipografia
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            },
          },
          // Botões primários com azul escuro e texto branco
          containedPrimary: {
            backgroundColor: COLORS.BLUE_DARK,
            color: COLORS.WHITE,
            '&:hover': {
              backgroundColor: '#07192e', // Versão mais escura para hover
            }
          },
          // Botões secundários com cor secundária (preto no claro, branco no escuro)
          containedSecondary: {
            backgroundColor: mode === 'light' ? COLORS.BLACK : COLORS.WHITE,
            color: mode === 'light' ? COLORS.WHITE : COLORS.BLACK,
            '&:hover': {
              backgroundColor: mode === 'light' ? '#1a1a1a' : '#e6e6e6',
            }
          },
          // Botões outlined com bordas da cor primária
          outlined: {
            borderColor: mode === 'light' ? COLORS.BLUE_DARK : COLORS.WHITE,
            color: mode === 'light' ? COLORS.BLUE_DARK : COLORS.WHITE,
            '&:hover': {
              borderColor: mode === 'light' ? '#07192e' : '#e6e6e6',
              backgroundColor: mode === 'light' ? 'rgba(10, 37, 64, 0.04)' : 'rgba(255, 255, 255, 0.04)',
            }
          }
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-root': {
              fontWeight: 600,
              fontSize: '0.875rem',
              backgroundColor: mode === 'light' ? COLORS.GRAY_LIGHT : COLORS.GRAY_DARKEST,
              color: mode === 'light' ? COLORS.BLACK : COLORS.WHITE,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
            borderBottom: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: mode === 'light' ? COLORS.GRAY_DARK : COLORS.GRAY_LIGHT,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? COLORS.WHITE : COLORS.GRAY_DARKEST,
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease, transform 0.2s ease',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 6px 24px rgba(0, 0, 0, 0.12)'
                : '0 6px 24px rgba(0, 0, 0, 0.25)',
            },
            overflow: 'hidden',
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? COLORS.WHITE : COLORS.BLACK,
            color: mode === 'light' ? COLORS.BLACK : COLORS.WHITE,
            boxShadow: mode === 'light' 
              ? '0px 1px 3px rgba(0, 0, 0, 0.08)' 
              : '0px 1px 3px rgba(0, 0, 0, 0.3)',
          },
          colorPrimary: {
            backgroundColor: COLORS.BLUE_DARK,
            color: COLORS.WHITE,
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? COLORS.WHITE : COLORS.BLACK,
            borderRight: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
          }
        }
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          standardInfo: {
            backgroundColor: mode === 'light' ? 'rgba(10, 37, 64, 0.08)' : 'rgba(10, 37, 64, 0.3)',
            color: mode === 'light' ? COLORS.BLUE_DARK : COLORS.WHITE,
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          colorPrimary: {
            backgroundColor: COLORS.BLUE_DARK,
            color: COLORS.WHITE,
          }
        }
      }
    },
  });

  // Valor do contexto
  const contextValue = {
    mode, 
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 