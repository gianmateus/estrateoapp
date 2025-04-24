import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: 4
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '10rem', fontWeight: 'bold', color: 'primary.main' }}>
        404
      </Typography>
      
      <Typography variant="h4" sx={{ mb: 2 }}>
        Página não encontrada
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        A página que você está procurando não existe ou foi movida para outro endereço.
      </Typography>
      
      <Button 
        variant="contained" 
        component={Link} 
        to="/dashboard"
        size="large"
      >
        Voltar para o Dashboard
      </Button>
    </Box>
  );
};

export default NotFound; 