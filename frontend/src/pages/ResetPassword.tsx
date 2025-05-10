import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage('Por favor, insira seu email');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Email de redefinição enviado! Verifique sua caixa de entrada.');
      setEmail('');
    } catch (error) {
      setErrorMessage('Erro ao solicitar redefinição de senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Redefinir Senha
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          Insira seu email e enviaremos instruções para redefinir sua senha.
        </Typography>
        
        {successMessage && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        
        {errorMessage && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Enviar'}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Voltar para login
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword; 