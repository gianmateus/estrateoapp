/**
 * Header component that displays the application's main branding with Estrateo logo and name
 * Uses Material UI components with responsive design for mobile and desktop screens
 * 
 * Componente de cabeçalho que exibe a marca principal da aplicação com logo e nome da Estrateo
 * Utiliza componentes do Material UI com design responsivo para telas móveis e desktop
 */
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  useMediaQuery, 
  useTheme,
  Container
} from '@mui/material';
import logo from '../assets/logo.png';

/**
 * Header component for the application with Estrateo logo and name
 * 
 * Componente de cabeçalho da aplicação com a logo e nome da Estrateo
 */
const Header = () => {
  // Access the theme object to use theme-based styling
  // Acessa o objeto de tema para usar estilização baseada no tema
  const theme = useTheme();
  
  // Check if the screen is small (mobile) to adjust sizes accordingly
  // Verifica se a tela é pequena (mobile) para ajustar tamanhos adequadamente
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#fff', // Mudando de azul escuro para branco
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', // Sombra mais sutil
        color: '#000' // Texto preto para contrastar com fundo branco
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ padding: '0 16px', justifyContent: 'flex-start' }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2, // Space between logo and text
                      // Espaço entre logo e texto
            }}
          >
            {/* Brand name 
                Nome da marca */}
            <Typography 
              variant="h6" 
              component="h1" 
              sx={{ 
                color: '#000', // Texto preto
                fontWeight: 'bold',
                letterSpacing: '0.5px', // Spacing for better readability
                                        // Espaçamento para melhor legibilidade
                fontSize: isMobile ? '1.2rem' : '1.5rem' // Smaller on mobile
                                                        // Menor em dispositivos móveis
              }}
            >
              ESTRATEO
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 