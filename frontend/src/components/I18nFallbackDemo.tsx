import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Grid, Button, Paper, Box, Alert } from '@mui/material';

/**
 * Componente para demonstrar o funcionamento do fallback de tradução
 * Exibe chaves de tradução em diferentes idiomas e testa o fallback para inglês
 */
const I18nFallbackDemo: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);

  // Atualizar o estado quando o idioma mudar
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Alternar entre idiomas
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Chaves para teste (incluindo algumas que não existirão em alguns idiomas)
  const testKeys = [
    { key: 'dashboard', description: 'Chave comum em todos os idiomas' },
    { key: 'finance_recurrence_quarterly', description: 'Chave com estrutura aninhada' },
    { key: 'teste.chave.ausente', description: 'Chave inexistente (deve usar fallback)' },
    { key: 'dashboard.title', description: 'Chave que pode estar ausente em alguns idiomas' }
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Demo de Fallback i18n
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          Este componente demonstra o comportamento de fallback para inglês quando uma chave de tradução está ausente
          no idioma selecionado.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Idioma atual: <strong>{currentLanguage}</strong>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button 
              variant={currentLanguage === 'pt' ? 'contained' : 'outlined'} 
              onClick={() => changeLanguage('pt')}
              size="small"
            >
              Português
            </Button>
            <Button 
              variant={currentLanguage === 'en' ? 'contained' : 'outlined'} 
              onClick={() => changeLanguage('en')}
              size="small"
            >
              English
            </Button>
            <Button 
              variant={currentLanguage === 'de' ? 'contained' : 'outlined'} 
              onClick={() => changeLanguage('de')}
              size="small"
            >
              Deutsch
            </Button>
            <Button 
              variant={currentLanguage === 'it' ? 'contained' : 'outlined'} 
              onClick={() => changeLanguage('it')}
              size="small"
            >
              Italiano
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {testKeys.map((item) => {
            const translation = t(item.key);
            const existsInCurrent = i18n.exists(item.key, { lng: currentLanguage });
            const existsInEn = i18n.exists(item.key, { lng: 'en' });
            const isUsingFallback = !existsInCurrent && existsInEn && translation === t(item.key, { lng: 'en' });
            
            return (
              <Grid item xs={12} md={6} key={item.key}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Chave:</strong> {item.key}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <em>{item.description}</em>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Existe em {currentLanguage}:</strong> {existsInCurrent ? 'Sim' : 'Não'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Existe em EN:</strong> {existsInEn ? 'Sim' : 'Não'}
                  </Typography>
                  <Box sx={{ mt: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body1">
                      <strong>Tradução:</strong> {translation}
                    </Typography>
                  </Box>
                  {isUsingFallback && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      Fallback para inglês funcionando! ✅
                    </Alert>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default I18nFallbackDemo; 