import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SecurityOutlined } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const AcessoNegado = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <SecurityOutlined color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Acesso Negado
        </Typography>
        <Typography variant="body1" paragraph>
          Você não possui permissão para acessar esta página.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Seu cargo atual ({user?.cargo}) não tem as permissões necessárias para esta funcionalidade.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Voltar para o Início
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AcessoNegado;