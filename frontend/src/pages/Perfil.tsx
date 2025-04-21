import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Visibility,
  VisibilityOff,
  VpnKey as KeyIcon,
  History as HistoryIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Perfil = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    tipoNegocio: user?.tipoNegocio || 'restaurante',
    whatsapp: user?.whatsapp || '',
    horarioFuncionamento: {
      diasFuncionamento: user?.horarioFuncionamento?.diasFuncionamento || ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
      horarioAbertura: user?.horarioFuncionamento?.horarioAbertura || '10:00',
      horarioFechamento: user?.horarioFuncionamento?.horarioFechamento || '22:00'
    }
  });
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Simulação de atividades recentes
  const activityLog = [
    { id: 1, action: 'Login no sistema', date: new Date(Date.now() - 3600000) },
    { id: 2, action: 'Alteração no inventário', date: new Date(Date.now() - 86400000) },
    { id: 3, action: 'Registro de pagamento', date: new Date(Date.now() - 172800000) },
  ];

  const diasSemana = [
    'domingo', 
    'segunda-feira', 
    'terça-feira', 
    'quarta-feira', 
    'quinta-feira', 
    'sexta-feira', 
    'sábado'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHorarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      horarioFuncionamento: {
        ...formData.horarioFuncionamento,
        [name]: value,
      },
    });
  };

  const handleDiasFuncionamentoChange = (dia: string) => {
    const diasAtuais = [...formData.horarioFuncionamento.diasFuncionamento];
    
    if (diasAtuais.includes(dia)) {
      // Remove o dia se já estiver selecionado
      const novosDias = diasAtuais.filter(d => d !== dia);
      setFormData({
        ...formData,
        horarioFuncionamento: {
          ...formData.horarioFuncionamento,
          diasFuncionamento: novosDias,
        },
      });
    } else {
      // Adiciona o dia se não estiver selecionado
      setFormData({
        ...formData,
        horarioFuncionamento: {
          ...formData.horarioFuncionamento,
          diasFuncionamento: [...diasAtuais, dia],
        },
      });
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    // Limpar erro ao digitar
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: '',
      });
    }
  };

  const handleSaveProfile = () => {
    // Aqui seria implementada a lógica para salvar as alterações no perfil
    // Em um ambiente real, isso envolveria uma chamada de API segura
    
    // Atualiza o objeto de usuário no contexto de autenticação
    // Esta é uma simulação - em produção, atualizaria via API
    if (user) {
      // Atualizar no sessionStorage (simulação)
      const updatedUser = {
        ...user,
        nome: formData.nome,
        email: formData.email,
        tipoNegocio: formData.tipoNegocio,
        whatsapp: formData.whatsapp,
        horarioFuncionamento: formData.horarioFuncionamento
      };
      
      sessionStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      // Forçar recarregamento da página para aplicar as mudanças
      // Em uma implementação real, atualizaríamos o contexto diretamente
      window.location.reload();
    }
    
    setEditMode(false);
    setSnackbar({
      open: true,
      message: 'Perfil atualizado com sucesso!',
      severity: 'success',
    });
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const validatePasswordForm = (): boolean => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'A senha atual é obrigatória';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'A nova senha é obrigatória';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'A senha deve ter pelo menos 8 caracteres';
      isValid = false;
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      errors.newPassword = 'A senha deve conter pelo menos uma letra maiúscula';
      isValid = false;
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      errors.newPassword = 'A senha deve conter pelo menos um número';
      isValid = false;
    } else if (!/[!@#$%^&*]/.test(passwordData.newPassword)) {
      errors.newPassword = 'A senha deve conter pelo menos um caractere especial (!@#$%^&*)';
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleChangePassword = () => {
    if (!validatePasswordForm()) {
      return;
    }

    // Simulação de mudança de senha bem-sucedida
    // Em um ambiente real, isso envolveria uma chamada de API segura
    handleClosePasswordDialog();
    setSnackbar({
      open: true,
      message: 'Senha alterada com sucesso!',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Usuário não autenticado</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Meu Perfil
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Informações Pessoais
              </Typography>
              {!editMode ? (
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(true)}
                >
                  Editar
                </Button>
              ) : (
                <Box>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setEditMode(false)}
                    sx={{ mr: 1 }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveProfile}
                  >
                    Salvar
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="WhatsApp (com DDD)"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                  margin="normal"
                  placeholder="Ex: 11999999999"
                  helperText="Digite apenas números, com DDD, sem espaços ou caracteres especiais"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tipo de Negócio"
                  name="tipoNegocio"
                  value={formData.tipoNegocio}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                  margin="normal"
                  placeholder="Ex: restaurante, pizzaria, bar, etc."
                  helperText="Importante para que a IA possa fornecer recomendações específicas"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RestaurantIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom>
                  Horário de Funcionamento
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Dias de Funcionamento
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {diasSemana.map((dia) => (
                      <Chip
                        key={dia}
                        label={dia}
                        onClick={() => editMode && handleDiasFuncionamentoChange(dia)}
                        color={formData.horarioFuncionamento.diasFuncionamento.includes(dia) ? "primary" : "default"}
                        disabled={!editMode}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    ))}
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Horário de Abertura"
                      name="horarioAbertura"
                      type="time"
                      value={formData.horarioFuncionamento.horarioAbertura}
                      onChange={handleHorarioChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Horário de Fechamento"
                      name="horarioFechamento"
                      type="time"
                      value={formData.horarioFuncionamento.horarioFechamento}
                      onChange={handleHorarioChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  mb: 2,
                }}
              >
                {user.nome.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" component="h3" gutterBottom>
                {user.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Chip
                label={user.cargo}
                color="primary"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Permissões
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {user.permissoes.map((permissao) => (
                  <Chip
                    key={permissao}
                    label={permissao}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Typography variant="h6" component="h3" gutterBottom>
                Atividades Recentes
              </Typography>
              <List dense>
                {activityLog.map((activity) => (
                  <ListItem key={activity.id}>
                    <ListItemIcon>
                      <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={activity.date.toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Diálogo para alteração de senha */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogContent>
          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!passwordErrors.currentPassword}
          >
            <InputLabel htmlFor="current-password">Senha Atual</InputLabel>
            <OutlinedInput
              id="current-password"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Senha Atual"
            />
            {passwordErrors.currentPassword && (
              <FormHelperText error>{passwordErrors.currentPassword}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!passwordErrors.newPassword}
          >
            <InputLabel htmlFor="new-password">Nova Senha</InputLabel>
            <OutlinedInput
              id="new-password"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Nova Senha"
            />
            {passwordErrors.newPassword && (
              <FormHelperText error>{passwordErrors.newPassword}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!passwordErrors.confirmPassword}
          >
            <InputLabel htmlFor="confirm-password">Confirmar Nova Senha</InputLabel>
            <OutlinedInput
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirmar Nova Senha"
            />
            {passwordErrors.confirmPassword && (
              <FormHelperText error>{passwordErrors.confirmPassword}</FormHelperText>
            )}
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleChangePassword} variant="contained" color="primary">
            Alterar Senha
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Perfil;