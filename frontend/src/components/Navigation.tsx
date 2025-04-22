/**
 * Sidebar navigation component for the application dashboard
 * Handles menu items, user options, and theme toggling with permission-based access control
 * 
 * Componente de navegação lateral para o dashboard da aplicação
 * Gerencia itens de menu, opções de usuário e alternância de tema com controle de acesso baseado em permissões
 */
import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  IconButton,
  useTheme,
  Divider,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  AccountBalance as FinanceiroIcon,
  Inventory as InventarioIcon,
  Payment as PagamentosIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  SmartToy as AIIcon,
  RestaurantMenu as RestaurantIcon,
  Dashboard as DashboardIcon,
  WhatsApp as WhatsAppIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
// Importing the Estrateo logo
// Importando a logo da Estrateo
import logo from '../assets/logo.png';

/**
 * Width of the navigation drawer
 * Controls the size of the sidebar
 * 
 * Largura do drawer de navegação
 * Controla o tamanho da barra lateral
 */
const drawerWidth = 240;

/**
 * Interface for navigation component properties
 * Defines the props that can be passed to the Navigation component
 * 
 * Interface de propriedades do componente de navegação
 * Define as props que podem ser passadas para o componente Navigation
 */
interface NavigationProps {
  toggleTheme: () => void;  // Function to toggle between light/dark themes
                           // Função para alternar entre temas claro/escuro
}

/**
 * Interface for navigation menu items
 * Defines the structure of each menu item in the sidebar
 * 
 * Interface para os itens do menu de navegação
 * Define a estrutura de cada item de menu na barra lateral
 */
interface MenuItem {
  text: string;             // Text to be displayed in the menu item
                           // Texto a ser exibido no item de menu
  icon: React.ReactNode;    // Icon component for the menu item
                           // Componente de ícone para o item de menu
  path: string;             // Navigation path when item is clicked
                           // Caminho de navegação quando o item é clicado
  permission: string | null; // Required permission to access/view this item (null means no permission required)
                           // Permissão necessária para acessar/visualizar este item (null significa que não é necessária permissão)
}

/**
 * Sidebar navigation component with menu and user options
 * Displays menu items based on user permissions and provides user profile access
 * 
 * Componente de navegação lateral com menu e opções de usuário
 * Exibe itens de menu com base nas permissões do usuário e fornece acesso ao perfil do usuário
 */
const Navigation = ({ toggleTheme }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user, logout, hasPermission } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { t, i18n } = useTranslation();
  const [languageMenuAnchor, setLanguageMenuAnchor] = React.useState<null | HTMLElement>(null);

  /**
   * Handler to open the user menu
   * Triggered when the user clicks on their profile avatar
   * 
   * Manipulador para abrir o menu de usuário
   * Acionado quando o usuário clica em seu avatar de perfil
   */
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handler to close the user menu
   * Called when user clicks away or selects an option
   * 
   * Manipulador para fechar o menu de usuário
   * Chamado quando o usuário clica fora ou seleciona uma opção
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handler to logout the user
   * Closes the menu and calls the logout function from AuthContext
   * 
   * Manipulador para realizar o logout do usuário
   * Fecha o menu e chama a função de logout do AuthContext
   */
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  /**
   * Handler to open the language menu
   * Triggered when the user clicks on the language button
   */
  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  /**
   * Handler to close the language menu
   */
  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  /**
   * Handler to change the application language
   * @param language Language code to change to
   */
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    handleLanguageMenuClose();
  };

  /**
   * Navigation menu items with their icons and required permissions
   * Each item specifies the route, display text, icon, and permission requirement
   * 
   * Itens do menu de navegação com seus ícones e permissões necessárias
   * Cada item especifica a rota, texto de exibição, ícone e requisito de permissão
   */
  const menuItems: MenuItem[] = [
    { 
      text: t('dashboard'), 
      icon: <DashboardIcon />, 
      path: '/dashboard',
      permission: null
    },
    { 
      text: t('financeiro'), 
      icon: <FinanceiroIcon />, 
      path: '/dashboard/financeiro',
      permission: 'financeiro.visualizar'
    },
    { 
      text: t('inventario'), 
      icon: <InventarioIcon />, 
      path: '/dashboard/inventario',
      permission: 'inventario.visualizar'
    },
    { 
      text: t('pagamentos'), 
      icon: <PagamentosIcon />, 
      path: '/dashboard/pagamentos',
      permission: 'pagamentos.visualizar'
    },
    { 
      text: t('inteligenciaArtificial'), 
      icon: <AIIcon />, 
      path: '/dashboard/inteligencia-artificial',
      permission: 'ia.visualizar'
    },
    { 
      text: t('whatsapp'), 
      icon: <WhatsAppIcon sx={{ color: '#25D366' }} />, 
      path: '/dashboard/whatsapp',
      permission: null
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Navigation header with logo and theme toggle button 
          Cabeçalho da navegação com logo e botão de alternância de tema */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(2),
          justifyContent: 'space-between',
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1,
            mx: 'auto'
          }}
        >
          {/* Estrateo logo displayed in the sidebar
              Logo da Estrateo exibida na barra lateral */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              letterSpacing: '0.5px',
              fontSize: '1.5rem'
            }}
          >
            ESTRATEO
          </Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          {/* Language toggle button */}
          <IconButton onClick={handleLanguageMenuOpen} sx={{ mr: 1 }}>
            <LanguageIcon />
          </IconButton>
          
          {/* Language selection menu */}
          <Menu
            anchorEl={languageMenuAnchor}
            open={Boolean(languageMenuAnchor)}
            onClose={handleLanguageMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => handleLanguageChange('en')}>{t('ingles')}</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('de')}>{t('alemao')}</MenuItem>
          </Menu>
          
          {/* Theme toggle button */}
          <IconButton onClick={toggleTheme}>
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Box>
      <Divider />
      
      {/* Main navigation menu with permission-based items
          Menu de navegação principal com itens baseados em permissões */}
      <List>
        {menuItems.map((item) => (
          (item.permission === null || hasPermission(item.permission)) && (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderLeft: location.pathname === item.path 
                    ? `4px solid ${theme.palette.primary.main}` 
                    : '4px solid transparent',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.12)' 
                      : 'rgba(0, 0, 0, 0.07)',
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        ))}
      </List>
      
      <Divider sx={{ mt: 'auto' }} />
      
      {/* User profile section at the bottom of sidebar
          Seção de perfil do usuário na parte inferior da barra lateral */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: theme.palette.primary.main,
              cursor: 'pointer',
              mr: 1
            }} 
            onClick={handleMenuOpen}
          >
            {user?.nome?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ ml: 1, overflow: 'hidden' }}>
            <Typography 
              variant="subtitle1" 
              noWrap 
              sx={{ fontWeight: 'medium', cursor: 'pointer' }}
              onClick={handleMenuOpen}
            >
              {user?.nome || t('usuarioDesconhecido')}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email || ''}
            </Typography>
          </Box>
        </Box>
        
        {/* User profile menu - appears when clicking on the avatar
            Menu de perfil do usuário - aparece ao clicar no avatar */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 1 }}
        >
          <MenuItem onClick={() => {
            handleMenuClose();
            navigate('/dashboard/perfil');
          }}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('perfil')} />
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primary={t('sair')} />
          </MenuItem>
        </Menu>
      </Box>
    </Drawer>
  );
};

export default Navigation;