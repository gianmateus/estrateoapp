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
  Divider,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Button,
  useTheme as useMuiTheme,
  Chip
} from '@mui/material';
import {
  AccountBalance as FinanceiroIcon,
  Inventory as InventarioIcon,
  Payment as PagamentosIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  SmartToy as AIIcon,
  RestaurantMenu as RestaurantIcon,
  Dashboard as DashboardIcon,
  WhatsApp as WhatsAppIcon,
  DateRange as CalendarioIcon,
  People as PeopleIcon,
  Assessment as ContadorIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  BarChart as ChartIcon,
  Money as MoneyIcon,
  AccessTime as AccessTimeIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
// Componentes de UI
import ToggleDarkModeButton from './ui/ToggleDarkModeButton';
import ToggleLanguageButton from './ui/ToggleLanguageButton';
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
  // Propriedades opcionais podem ser adicionadas aqui no futuro
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
  subItems?: MenuItem[];    // Optional list of sub-items for nested menu
                           // Lista opcional de sub-itens para menu aninhado
  isExpanded?: boolean;     // Whether the submenu is expanded (only applicable for items with subItems)
                           // Se o submenu está expandido (aplicável apenas para itens com subItems)
  badge?: {
    text: string;
    color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  };
}

/**
 * Sidebar navigation component with menu and user options
 * Displays menu items based on user permissions and provides user profile access
 * 
 * Componente de navegação lateral com menu e opções de usuário
 * Exibe itens de menu com base nas permissões do usuário e fornece acesso ao perfil do usuário
 */
const Navigation = ({}: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const { user, logout, hasPermission } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  
  // Estado para controlar quais submenus estão expandidos
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({});

  // Toggle para expandir/recolher submenu
  const toggleSubmenu = (itemText: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
  };

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
   * Navigation menu items with their icons and required permissions
   * Each item specifies the route, display text, icon, and permission requirement
   * 
   * Itens do menu de navegação com seus ícones e permissões necessárias
   * Cada item especifica a rota, texto de exibição, ícone e requisito de permissão
   */
  const menuItems: MenuItem[] = [
    { 
      text: "Dashboard", 
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
      text: t('impostos'), 
      icon: <ReceiptIcon />, 
      path: '/dashboard/taxes',
      permission: 'financeiro.visualizar'
    },
    { 
      text: t('calendario'), 
      icon: <CalendarioIcon />, 
      path: '/dashboard/calendario',
      permission: 'calendario.visualizar'
    },
    { 
      text: t('funcionarios'), 
      icon: <PeopleIcon />, 
      path: '/dashboard/funcionarios',
      permission: 'funcionarios.visualizar',
      subItems: [
        {
          text: t('visaoGeral'),
          icon: <PersonIcon />,
          path: '/dashboard/funcionarios',
          permission: 'funcionarios.visualizar',
        },
        {
          text: t('estatisticas'),
          icon: <ChartIcon />,
          path: '/dashboard/funcionarios?tab=1',
          permission: 'funcionarios.visualizar',
        },
        {
          text: t('folhaPagamento'),
          icon: <MoneyIcon />,
          path: '/dashboard/funcionarios?tab=2',
          permission: 'funcionarios.visualizar',
        },
        {
          text: t('tempoFerias'),
          icon: <AccessTimeIcon />,
          path: '/dashboard/funcionarios/time-vacations',
          permission: 'funcionarios.visualizar',
        }
      ]
    },
    { 
      text: t('contador'), 
      icon: <ContadorIcon />, 
      path: '/dashboard/contador',
      permission: 'financeiro.visualizar'
    },
    { 
      text: t('inteligenciaArtificial'), 
      icon: <AIIcon />, 
      path: '/dashboard/inteligencia-artificial',
      permission: 'ia.visualizar',
      badge: {
        text: 'ALPHA',
        color: 'warning'
      }
    },
    { 
      text: t('whatsapp'), 
      icon: <WhatsAppIcon sx={{ color: '#25D366' }} />, 
      path: '/dashboard/whatsapp',
      permission: null,
      badge: {
        text: 'ALPHA',
        color: 'warning'
      }
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
          borderRight: `1px solid ${muiTheme.palette.divider}`,
        },
      }}
    >
      <Box 
        sx={{ 
          padding: 2, 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {/* Logo and app name with link to dashboard */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1,
            justifyContent: 'space-between'
          }}
        >
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Estrateo" width={32} height={32} style={{ marginRight: 8 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: muiTheme.palette.primary.main }}>
              Estrateo
            </Typography>
          </Link>
        </Box>
        
        {/* Configurações globais (tema e idioma) - posicionados diretamente abaixo do logo */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, gap: 1 }}>
          <ToggleDarkModeButton tooltipPlacement="bottom" />
          <ToggleLanguageButton tooltipPlacement="bottom" />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Main navigation menu with permission-based items */}
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            // Only display menu items if user has the required permission
            // (or if the item doesn't require a permission)
            (!item.permission || hasPermission(item.permission)) && (
              <React.Fragment key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => item.subItems ? toggleSubmenu(item.text) : navigate(item.path)}
                    selected={!item.subItems && location.pathname === item.path}
                    sx={{
                      borderLeft: (!item.subItems && location.pathname === item.path) || 
                                  (item.subItems && location.pathname.startsWith(item.path))
                        ? `4px solid ${muiTheme.palette.primary.main}` 
                        : '4px solid transparent',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(25, 118, 210, 0.2)',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      },
                      backgroundColor: 'rgba(245, 245, 245, 0.9)',
                      marginBottom: '4px',
                      borderRadius: '4px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: '#000000' }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      sx={{ '& .MuiTypography-root': { color: '#000000 !important', fontWeight: 'bold' } }}
                    />
                    {item.badge && (
                      <Chip 
                        label={item.badge.text}
                        color={item.badge.color}
                        size="small"
                        sx={{ 
                          height: 20, 
                          fontSize: '0.65rem', 
                          fontWeight: 'bold',
                          ml: 1
                        }}
                      />
                    )}
                    {item.subItems && (
                      expandedMenus[item.text] ? 
                        <KeyboardArrowUpIcon sx={{ color: '#000000' }} /> : 
                        <KeyboardArrowDownIcon sx={{ color: '#000000' }} />
                    )}
                  </ListItemButton>
                </ListItem>
                
                {/* Render submenu items if they exist and the parent menu is expanded */}
                {item.subItems && expandedMenus[item.text] && (
                  <List component="div" disablePadding>
                    {item.subItems.map(subItem => (
                      (!subItem.permission || hasPermission(subItem.permission)) && (
                        <ListItem key={subItem.text} disablePadding>
                          <ListItemButton
                            onClick={() => navigate(subItem.path)}
                            selected={location.pathname + location.search === subItem.path}
                            sx={{
                              pl: 4,
                              borderLeft: location.pathname + location.search === subItem.path
                                ? `4px solid ${muiTheme.palette.primary.main}` 
                                : '4px solid transparent',
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(25, 118, 210, 0.2)',
                              },
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                              },
                              backgroundColor: 'rgba(245, 245, 245, 0.9)',
                              marginBottom: '3px',
                              marginLeft: '10px',
                              borderRadius: '4px',
                              border: '1px solid rgba(0, 0, 0, 0.1)',
                            }}
                          >
                            <ListItemIcon
                              sx={{ color: '#000000' }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={subItem.text} 
                              sx={{ '& .MuiTypography-root': { color: '#000000 !important', fontWeight: 'bold' } }}
                            />
                            {subItem.badge && (
                              <Chip 
                                label={subItem.badge.text}
                                color={subItem.badge.color}
                                size="small"
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.65rem', 
                                  fontWeight: 'bold',
                                  ml: 1
                                }}
                              />
                            )}
                          </ListItemButton>
                        </ListItem>
                      )
                    ))}
                  </List>
                )}
              </React.Fragment>
            )
          ))}
        </List>

        {/* Bottom user section with profile link and menu */}
        <Divider sx={{ mt: 'auto' }} />
        
        {/* User profile section */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            onClick={handleMenuOpen}
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: muiTheme.palette.primary.main,
              cursor: 'pointer',
              mr: 1
            }}
          >
            {user?.nome && user.nome[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {user?.nome || t('usuarioDesconhecido')}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {user?.email || 'email@exemplo.com'}
            </Typography>
          </Box>
          
          {/* User menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard/perfil'); }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              {t('perfil')}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              {t('sair')}
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Navigation;