/**
 * Página de Erro 404 (Not Found)
 * 
 * Componente estilizado para exibir quando uma rota não é encontrada,
 * seguindo o design system padronizado da aplicação.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  useTheme 
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  SearchOff as SearchOffIcon 
} from '@mui/icons-material';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  // Utilizando as mesmas cores padronizadas do tema
  const primaryColor = theme.palette.primary.main;
  const backgroundColor = theme.palette.mode === 'dark' 
    ? 'rgba(26, 54, 93, 0.08)'
    : 'rgba(26, 54, 93, 0.04)';
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: 'calc(100vh - 200px)',
          py: 8,
        }}
      >
        <Box
          sx={{
            p: 4,
            mb: 4,
            borderRadius: '50%',
            bgcolor: backgroundColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SearchOffIcon
            sx={{
              fontSize: 80,
              color: primaryColor,
            }}
          />
        </Box>
        
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            mb: 2,
            fontWeight: 700,
            color: primaryColor,
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            mb: 2,
          }}
        >
          {t('paginaNaoEncontrada') || 'Página não encontrada'}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            maxWidth: 500,
            mx: 'auto',
            color: theme.palette.text.secondary,
          }}
        >
          {t('mensagemPaginaNaoEncontrada') || 'A página que você está procurando não existe ou foi movida. Por favor, verifique a URL ou navegue para outra página.'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{ minWidth: 160 }}
          >
            {t('voltar') || 'Voltar'}
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleGoBack}
            startIcon={<ArrowBackIcon />}
            sx={{ minWidth: 160 }}
          >
            {t('voltarPagina') || 'Voltar para página anterior'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound; 