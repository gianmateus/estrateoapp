import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [currency, setCurrency] = useState('EUR');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const handleSaveSettings = () => {
    // Simulação de salvamento das configurações
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('configuracoes')}
      </Typography>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('preferenciasGerais')}
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                color="primary"
              />
            }
            label={t('notificacoesNavegador')}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={emailNotificationsEnabled}
                onChange={(e) => setEmailNotificationsEnabled(e.target.checked)}
                color="primary"
              />
            }
            label={t('notificacoesEmail')}
          />
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          {t('localizacao')}
        </Typography>
        
        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="currency-select-label">{t('moeda')}</InputLabel>
            <Select
              labelId="currency-select-label"
              value={currency}
              label={t('moeda')}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value="EUR">Euro (€)</MenuItem>
              <MenuItem value="USD">Dólar Americano ($)</MenuItem>
              <MenuItem value="BRL">Real Brasileiro (R$)</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
          >
            {t('salvarConfiguracoes')}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {t('configuracoesSalvas')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 