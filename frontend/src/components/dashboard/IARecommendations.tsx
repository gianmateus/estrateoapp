/**
 * Componente IARecommendations - Exibe recomendações da IA
 * Component IARecommendations - Displays AI recommendations
 * 
 * Mostra as recomendações geradas pela IA em uma lista formatada
 * Shows AI-generated recommendations in a formatted list
 */

import React from 'react';
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  SmartToy as AIIcon,
  Insights as InsightsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

interface IARecommendationsProps {
  recommendations: string[];
}

const IARecommendations: React.FC<IARecommendationsProps> = ({
  recommendations
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Ícones diferentes para cada recomendação para melhorar o visual
  // Different icons for each recommendation to improve visuals
  const icons = [
    <InsightsIcon key="insights" fontSize="small" sx={{ color: theme.palette.info.main }} />,
    <TrendingUpIcon key="trending" fontSize="small" sx={{ color: theme.palette.success.main }} />,
    <WarningIcon key="warning" fontSize="small" sx={{ color: theme.palette.warning.main }} />,
    <LightbulbIcon key="lightbulb" fontSize="small" sx={{ color: theme.palette.secondary.main }} />
  ];

  return (
    <Box sx={{ pb: 5 }}>
      <Card sx={{ borderRadius: 4, boxShadow: theme.shadows[3], p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AIIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('recomendacoesIA')}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box>
          {recommendations && recommendations.length > 0 ? (
            <List>
              {recommendations.map((recommendation, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: index < recommendations.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                    py: 2,
                    borderRadius: 1,
                    bgcolor: index % 2 === 1 ? `${theme.palette.primary.main}05` : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Box sx={{
                      backgroundColor: `${theme.palette.info.main}15`,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {icons[index % icons.length]}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={recommendation}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              {t('semDadosNoPeriodo')}
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default IARecommendations; 