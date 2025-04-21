/**
 * Main application component that sets up the core structure of the Estrateo application
 * Handles theme configuration, routing, and global context providers
 * 
 * Componente principal da aplicação que configura a estrutura central da aplicação Estrateo
 * Gerencia configuração de tema, rotas e provedores de contexto globais
 */
import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Financeiro from './pages/Financeiro';
import Inventario from './pages/Inventario';
import Pagamentos from './pages/Pagamentos';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Perfil from './pages/Perfil';
import AcessoNegado from './pages/AcessoNegado';
import InteligenciaArtificial from './pages/InteligenciaArtificial';
import Dashboard from './pages/Dashboard';
import Whatsapp from './pages/Whatsapp';
import TodoPage from './pages/TodoPage';
import ProtectedRoute from './components/ProtectedRoute';
import { DataProvider } from './contexts/DataProvider';
import { useTranslation } from 'react-i18next';
import { LanguageProvider, translations } from './contexts/IdiomaContext';
import { 
  VIEW_DASHBOARD_PERMISSION, 
  VIEW_PAYMENTS_PERMISSION,
  VIEW_INVENTORY_PERMISSION,
  VIEW_PROFILE_PERMISSION
} from './constants/permissions';

/**
 * Light theme color palette based on Estrateo's institutional colors
 * Defines colors for UI elements, text, backgrounds and state indicators
 * 
 * Paleta de cores para o tema claro baseada nas cores institucionais da Estrateo
 * Define cores para elementos de UI, texto, fundos e indicadores de estado
 */
const lightPalette = {
  primary: {
    main: '#000000', // Changed from institutional blue to black
                     // Alterado do azul institucional para preto
    light: '#333333',
    dark: '#000000',
    contrastText: '#fff',
  },
  secondary: {
    main: '#000000', // Changed from blue to black for highlights
                     // Alterado de azul para preto para destaques
    light: '#333333',
    dark: '#000000',
    contrastText: '#fff',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
  },
  warning: {
    main: '#ED6C02',
    light: '#FF9800',
    dark: '#E65100',
  },
  info: {
    main: '#0288D1',
    light: '#03A9F4',
    dark: '#01579B',
  },
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
  },
  background: {
    default: '#F8F9FC', // Light blue-tinted background to match brand color
                        // Fundo levemente azulado para combinar com a cor da marca
    paper: '#FFFFFF',   // Pure white for contrast with dark background
                        // Branco puro para contrastar com o fundo escuro
  },
  text: {
    primary: '#000000', // Changed from blue to black for main text
                        // Alterado de azul para preto para texto principal
    secondary: '#333333', // Changed from grayish blue to dark gray
                          // Alterado de azul acinzentado para cinza escuro
    disabled: '#9E9E9E',
  },
};

/**
 * Dark theme color palette based on Estrateo's institutional colors
 * Uses brighter and higher contrast values suitable for dark mode
 * 
 * Paleta de cores para o tema escuro baseada nas cores institucionais da Estrateo
 * Usa valores mais brilhantes e com maior contraste adequados para o modo escuro
 */
const darkPalette = {
  primary: {
    main: '#447EFF', // Brighter blue for dark mode
                     // Azul mais brilhante para modo escuro
    light: '#6A99FF',
    dark: '#2A64E5',
    contrastText: '#fff',
  },
  secondary: {
    main: '#6A99FF', // Even lighter blue for secondary elements
                     // Azul ainda mais claro para elementos secundários
    light: '#8FB0FF',
    dark: '#3D75FF',
    contrastText: '#fff',
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
    default: '#121C3A', // Very dark blue for background
                        // Azul muito escuro para fundo
    paper: '#1A2E66',   // Darker institutional blue for cards
                        // Azul institucional mais escuro para cartões
  },
  text: {
    primary: '#FFFFFF', // Pure white for main text
                        // Branco puro para texto principal
    secondary: '#C0C5D6', // Light blue for secondary text
                          // Azul claro para texto secundário
    disabled: '#6E6E6E',
  },
};

/**
 * Main application component that configures themes, routes, and providers
 * Creates the application structure and defines routing logic
 * 
 * Componente principal da aplicação que configura temas, rotas e provedores
 * Cria a estrutura da aplicação e define a lógica de roteamento
 */
function App() {
  // State to control the theme (light/dark) of the application
  // Estado para controlar o tema (claro/escuro) da aplicação
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  // Using the useTranslation hook to manage language
  // Usar o hook useTranslation para gerenciar o idioma
  const { i18n } = useTranslation();

  /**
   * Theme creation based on the selected mode (light/dark)
   * Uses Material UI's createTheme to generate a complete theme with typography, shape, and component styles
   * 
   * Criação do tema com base no modo selecionado (claro/escuro)
   * Usa o createTheme do Material UI para gerar um tema completo com tipografia, formato e estilos de componentes
   */
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light' ? lightPalette : darkPalette),
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 500,
            fontSize: '2.5rem',
          },
          h2: {
            fontWeight: 500,
            fontSize: '2rem',
          },
          h3: {
            fontWeight: 500,
            fontSize: '1.75rem',
          },
          h4: {
            fontWeight: 500,
            fontSize: '1.5rem',
          },
          h5: {
            fontWeight: 500,
            fontSize: '1.25rem',
          },
          h6: {
            fontWeight: 500,
            fontSize: '1rem',
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                },
              },
              containedPrimary: {
                '&:hover': {
                  backgroundColor: mode === 'light' ? '#68A87A' : '#6FB587',
                },
              },
              containedSecondary: {
                '&:hover': {
                  backgroundColor: mode === 'light' ? '#E8936A' : '#F29D73',
                },
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#000000',
                  boxShadow: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#000000',
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                '&.Mui-focused': {
                  color: '#000000',
                },
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                '&.Mui-checked': {
                  color: '#000000',
                },
              },
            },
          },
          MuiRadio: {
            styleOverrides: {
              root: {
                '&.Mui-checked': {
                  color: '#000000',
                },
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                '&.Mui-checked': {
                  color: '#000000',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#000000',
                  },
                },
              },
            },
          },
          MuiStepIcon: {
            styleOverrides: {
              root: {
                '&.Mui-active': {
                  color: '#000000',
                },
                '&.Mui-completed': {
                  color: '#000000',
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              icon: {
                color: '#000000',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'light' 
                  ? '0px 4px 12px rgba(0, 0, 0, 0.05)' 
                  : '0px 4px 12px rgba(0, 0, 0, 0.2)',
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
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' 
                  ? '0px 2px 8px rgba(0, 0, 0, 0.1)' 
                  : '0px 2px 8px rgba(0, 0, 0, 0.3)',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: '12px 16px',
              },
              head: {
                fontWeight: 600,
                backgroundColor: mode === 'light' 
                  ? 'rgba(62, 136, 91, 0.08)' 
                  : 'rgba(74, 149, 104, 0.15)',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'light' ? '#FFF' : '#1E2128',
                borderRight: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  /**
   * Function to toggle between light and dark themes
   * 
   * Função para alternar entre os temas claro e escuro
   */
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  /**
   * Function to change the application language
   * Uses i18n to switch between supported languages
   * 
   * Função para mudar o idioma da aplicação
   * Usa i18n para alternar entre idiomas suportados
   */
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Language provider value using i18n
  const languageValue = useMemo(() => {
    // Verificar se o idioma atual está entre os suportados
    const currentLang = i18n.language;
    
    return {
      language: currentLang,
      setLanguage: changeLanguage,
      translations
    };
  }, [i18n.language, changeLanguage]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <LanguageProvider value={languageValue}>
          <DataProvider>
            <Routes>
              {/* Public routes accessible without authentication
                  Rotas públicas acessíveis sem autenticação */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/acesso-negado" element={<AcessoNegado />} />
              
              {/* Nova rota para o componente Todo */}
              <Route path="/todo" element={<TodoPage />} />

              {/* Protected routes with Dashboard layout - require specific permissions
                  Rotas protegidas com layout do Dashboard - requerem permissões específicas */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredPermission={VIEW_DASHBOARD_PERMISSION}>
                  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation toggleTheme={toggleTheme} />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <Dashboard />
                    </Box>
                  </Box>
                </ProtectedRoute>
              } />
              {/* Financial module route - requires specific permission
                  Rota para o módulo financeiro - requer permissão específica */}
              <Route path="/dashboard/financeiro" element={
                <ProtectedRoute requiredPermission="financeiro.visualizar">
                  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation toggleTheme={toggleTheme} />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <Financeiro />
                    </Box>
                  </Box>
                </ProtectedRoute>
              } />
              {/* Inventory module route - requires specific permission
                  Rota para o módulo de inventário - requer permissão específica */}
              <Route path="/dashboard/inventario" element={
                <ProtectedRoute requiredPermission={VIEW_INVENTORY_PERMISSION}>
                  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation toggleTheme={toggleTheme} />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <Inventario />
                    </Box>
                  </Box>
                </ProtectedRoute>
              } />
              {/* Payments module route - requires specific permission
                  Rota para o módulo de pagamentos - requer permissão específica */}
              <Route path="/dashboard/pagamentos" element={
                <ProtectedRoute requiredPermission={VIEW_PAYMENTS_PERMISSION}>
                  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation toggleTheme={toggleTheme} />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <Pagamentos />
                    </Box>
                  </Box>
                </ProtectedRoute>
              } />
              {/* AI module route - requires specific permission
                  Rota para o módulo de IA - requer permissão específica */}
              <Route path="/dashboard/inteligencia-artificial" element={
                <ProtectedRoute requiredPermission="ia.visualizar">
                  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation toggleTheme={toggleTheme} />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <InteligenciaArtificial />
                    </Box>
                  </Box>
                </ProtectedRoute>
              } />
              {/* User profile route - requires profile viewing permission
                  Rota para o perfil do usuário - requer permissão de visualização de perfil */}
              <Route path="/dashboard/perfil" element={
                <ProtectedRoute requiredPermission={VIEW_PROFILE_PERMISSION}>
                  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation toggleTheme={toggleTheme} />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <Perfil />
                    </Box>
                  </Box>
                </ProtectedRoute>
              } />
              {/* WhatsApp module route - requires authentication but no special permission
                  Rota para o módulo do WhatsApp - requer autenticação mas sem permissão especial */}
              <Route path="/dashboard/whatsapp" element={
                <ProtectedRoute>
                  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation toggleTheme={toggleTheme} />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <Whatsapp />
                    </Box>
                  </Box>
                </ProtectedRoute>
              } />
              
              {/* Redirects for routes not found
                  Redirecionamentos para rotas não encontradas */}
              <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DataProvider>
        </LanguageProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;