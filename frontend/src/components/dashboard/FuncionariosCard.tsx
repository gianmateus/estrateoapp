import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Chip,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  BeachAccess as BeachAccessIcon,
  LocalHospital as HospitalIcon,
  Cancel as CancelIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

// Interface para o objeto de contagem por situação
interface SituacaoCount {
  ativo: number;
  ferias: number;
  afastado: number;
  desligado: number;
}

const FuncionariosCard: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [situacaoCount, setSituacaoCount] = useState<SituacaoCount>({
    ativo: 0,
    ferias: 0,
    afastado: 0,
    desligado: 0
  });
  const [totalFuncionarios, setTotalFuncionarios] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obter contagem de funcionários por situação
        const response = await api.get<SituacaoCount>('/funcionarios-por-situacao');
        setSituacaoCount(response.data);
        
        // Calcular total de funcionários
        const total = Object.values(response.data).reduce((sum: number, count: number) => sum + count, 0);
        setTotalFuncionarios(total);
      } catch (error) {
        console.error('Erro ao buscar dados de funcionários:', error);
        // Usar dados mockados em caso de erro
        const mockData: SituacaoCount = {
          ativo: 15,
          ferias: 3,
          afastado: 2,
          desligado: 1
        };
        setSituacaoCount(mockData);
        setTotalFuncionarios(Object.values(mockData).reduce((sum: number, count: number) => sum + count, 0));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {t('Equipe')}
          </Typography>
          <PeopleIcon color="primary" />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <>
            <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
              {totalFuncionarios}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List disablePadding>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <PersonIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={t('Ativos')} 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
                <Chip 
                  label={situacaoCount.ativo} 
                  color="success" 
                  size="small" 
                  variant="outlined" 
                />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <BeachAccessIcon sx={{ color: 'info.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={t('Férias')} 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
                <Chip 
                  label={situacaoCount.ferias} 
                  color="info" 
                  size="small" 
                  variant="outlined" 
                />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <HospitalIcon sx={{ color: 'warning.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={t('Afastados')} 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
                <Chip 
                  label={situacaoCount.afastado} 
                  color="warning" 
                  size="small" 
                  variant="outlined" 
                />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <CancelIcon sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={t('Desligados')} 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
                <Chip 
                  label={situacaoCount.desligado} 
                  color="error" 
                  size="small" 
                  variant="outlined" 
                />
              </ListItem>
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FuncionariosCard; 