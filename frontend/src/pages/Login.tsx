import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  WifiOff,
  ErrorOutline,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

/**
 * Login component for user authentication
 * Handles form validation, error messages, and authentication flow
 * 
 * Componente de login para autenticação do usuário
 * Gerencia validação de formulário, mensagens de erro e fluxo de autenticação
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Redirect if already authenticated
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  /**
   * Validates email format
   * Returns true if valid, false otherwise
   * 
   * Valida o formato do email
   * Retorna true se válido, false caso contrário
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    // Using direct English message instead of translation key
    // Usando mensagem em inglês direta ao invés de chave de tradução
    setEmailError(isValid ? '' : "Invalid email address");
    return isValid;
  };

  /**
   * Validates password length
   * Returns true if valid, false otherwise
   * 
   * Valida o comprimento da senha
   * Retorna true se válida, false caso contrário
   */
  const validatePassword = (password: string): boolean => {
    // Using direct English message instead of translation key
    // Usando mensagem em inglês direta ao invés de chave de tradução
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  /**
   * Handles form submission for login
   * Validates fields and attempts authentication
   * 
   * Gerencia o envio do formulário para login
   * Valida campos e tenta autenticação
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic field validation
    // Validação básica dos campos
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("An error occurred during login");
    }
  };

  /**
   * Toggles password visibility
   * 
   * Alterna a visibilidade da senha
   */
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Redirects to pricing/signup page
   * 
   * Redireciona para a página de preços/cadastro
   */
  const handleCreateAccount = () => {
    navigate('/pricing');
  };

  return (
    <Box 
      sx={{ 
        bgcolor: '#fff', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card
            elevation={0}
            sx={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #eaeaea',
            }}
          >
            <Box
              sx={{
                p: 4,
                pb: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Company logo with black color (#000000) */}
              {/* Logo da empresa na cor preta (#000000) */}
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  fontSize: '1.5rem',
                  color: '#000', // Changed from #1A2E66 to #000
                  mb: 1
                }}
              >
                ESTRATEO
              </Typography>
              
              {/* Welcome heading in English */}
              {/* Título de boas-vindas em inglês */}
              <Typography 
                component="h1" 
                variant="h4" 
                fontWeight="700"
                sx={{
                  letterSpacing: '-0.02em',
                  color: '#000',
                  mb: 1
                }}
              >
                Welcome back
              </Typography>
              
              {/* Subtitle in English */}
              {/* Subtítulo em inglês */}
              <Typography 
                variant="body1" 
                color="text.secondary" 
                align="center"
                sx={{ mb: 4 }}
              >
                Please login to continue
              </Typography>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    width: '100%',
                    borderRadius: '8px'
                  }}
                  icon={
                    error.includes('Network error') ? (
                      <Box component="span">
                        <Tooltip title="Check your internet connection or try again later">
                          <WifiOff fontSize="inherit" />
                        </Tooltip>
                      </Box>
                    ) : (
                      <Box component="span">
                        <ErrorOutline fontSize="inherit" />
                      </Box>
                    )
                  }
                >
                  {typeof error === 'string' ? error : ''}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  error={!!emailError}
                  helperText={typeof emailError === 'string' ? emailError : ''}
                  InputProps={{
                    // Basic sanitization to prevent XSS
                    // Sanitização básica para prevenir XSS
                    inputProps: {
                      maxLength: 100,
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />

                <FormControl
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!passwordError}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                >
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) validatePassword(e.target.value);
                    }}
                    onBlur={() => validatePassword(password)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    inputProps={{
                      maxLength: 50,
                      autoComplete: 'current-password',
                    }}
                  />
                  {passwordError && (
                    <FormHelperText error>{typeof passwordError === 'string' ? passwordError : ''}</FormHelperText>
                  )}
                </FormControl>

                {/* Authentication buttons stack */}
                {/* Pilha de botões de autenticação */}
                <Stack spacing={2} sx={{ mt: 3 }}>
                  {/* Sign in button */}
                  {/* Botão de entrar */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      py: 1.5,
                      borderRadius: '6px',
                      bgcolor: '#000',
                      color: '#fff',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#333',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Box component="span" sx={{ display: 'inline-flex' }}>
                        <CircularProgress size={24} color="inherit" />
                      </Box>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  {/* Create account button - redirects to pricing page */}
                  {/* Botão de criar conta - redireciona para página de preços */}
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ 
                      py: 1.5,
                      borderRadius: '6px',
                      borderColor: '#000',
                      color: '#000',
                      '&:hover': {
                        borderColor: '#333',
                        bgcolor: 'rgba(0,0,0,0.04)'
                      }
                    }}
                    onClick={handleCreateAccount}
                  >
                    Create account
                  </Button>
                </Stack>

                {/* Demo credentials section in English */}
                {/* Seção de credenciais de demonstração em inglês */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                    Demo credentials:
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email: admin@estrateo.com | Password: Estrateo@123
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;